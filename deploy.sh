#!/bin/bash

echo "🔨 Building JAR..."
export JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-21.0.10.7-hotspot"
./mvnw clean package -DskipTests

if [ $? -ne 0 ]; then
  echo "❌ Build failed, aborting deploy"
  exit 1
fi

echo "📦 Copying JAR to Pi..."
scp target/dungeonscribe-0.0.1-SNAPSHOT.jar admin@FoundryVTT.local:/mnt/ssd/dungeonscribe.jar

if [ $? -ne 0 ]; then
  echo "❌ Copy failed, aborting deploy"
  exit 1
fi

echo "🔄 Restarting service..."
ssh admin@raspberrypi.local "sudo systemctl restart dungeonscribe"

echo "✅ Deploy complete!"
