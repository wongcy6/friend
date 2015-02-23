package controllers

import play.api._
import play.api.libs.json.Json
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.main())
  }

  def list = Action {
    Ok(Json.toJson(Map("name" -> "Richard", "Gender" -> "Male")))
  }
}