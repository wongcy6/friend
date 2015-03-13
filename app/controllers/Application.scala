package controllers

import java.io.File
import java.net.InetAddress
import java.util.Date

import akka.actor.{Props, ActorRef}
import com.maxmind.geoip2.DatabaseReader
import com.maxmind.geoip2.model.CityResponse
import com.maxmind.geoip2.record.Location
import play.api._
import play.api.libs.concurrent.Promise
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.libs.json.Json
import play.api.mvc._

import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.duration.Duration
import scala.io.Source

object Application extends Controller {

  def index = Action {
    Ok(views.html.main())
  }

  def list = Action {
    Ok(Json.toJson(Map("name" -> "Isabella", "Gender" -> "Dog")))
  }

  def fb = Action {
    Ok(views.html.fb())
  }

  def react = Action {
    Ok(views.html.react())
  }

  def tts = Action {
    Ok(views.html.tts())
  }

  def heatmap = Action {
    Ok(views.html.heatmap())
  }

  def readFile : Iterator[Map[String, String]] = {
    val content=Source.fromFile("/Users/rwong/Downloads/results-20150312-170723.csv").getLines.map(_.split(","))
    val header=content.next
    content.map(header.zip(_).toMap)
  }

  val database = new File("/Users/rwong/Downloads/GeoLite2-City.mmdb")
  val reader = new DatabaseReader.Builder(database).build()

  def getLocation(ipString : String) = {
    val ipAddress = InetAddress.getByName(ipString)
    val response = reader.city(ipAddress);
    response.getLocation();
  }

  def ws = WebSocket.using[String] { request =>
    val data = readFile
    var prev : Long = 0

    val in = Iteratee.consume[String]()
    val out = Enumerator.generateM [String] {
      val next = data.next

      val outBoundData =
      {
        val clone = collection.mutable.Map[String, String]() ++= next
        val location = getLocation(next.get("ip").getOrElse(""))
        clone.put("latitude", location.getLatitude.toString)
        clone.put("longitude", location.getLongitude.toString)
        clone
      }

      val json = Json.toJson(outBoundData.toMap).toString()
      val duration = if (prev == 0) Duration(0, "millis") else Duration((next.get("time").getOrElse("0").toLong - prev), "millis")
      prev = next.get("time").getOrElse("0").toLong

      println(json)
      Promise.timeout(Some(json), duration)
    }

    (in, out)
  }

}