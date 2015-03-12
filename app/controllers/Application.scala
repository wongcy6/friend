package controllers

import java.util.Date

import akka.actor.{Props, ActorRef}
import play.api._
import play.api.libs.concurrent.Promise
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.libs.json.Json
import play.api.mvc._

import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.duration.Duration
import scala.util.Random

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

  def ws = WebSocket.using[String] { request =>
    val random = Random
    val in = Iteratee.consume[String]()

    val out = Enumerator.generateM [String] {
      val ipString = "%d.%d.%d.%d".format(random.nextInt(255)+1, random.nextInt(255)+1, random.nextInt(255)+1, random.nextInt(255)+1)
      val json = Json.toJson(Map("ip" -> ipString, "speed" -> (Math.abs(random.nextGaussian()) * 10).toString)).toString()
      Promise.timeout(Some(json), Duration(2000, "millis"))
    }

    (in, out)
  }

}