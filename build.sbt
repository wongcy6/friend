name := "friend"

version := "1.0.10-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

libraryDependencies += "com.maxmind.geoip2" % "geoip2" % "2.1.0"


play.Project.playScalaSettings
