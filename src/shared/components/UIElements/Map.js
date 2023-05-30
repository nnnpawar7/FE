import React, { useEffect, useRef } from "react"
import Map from "ol/Map"
import View from "ol/View"
import OSM from "ol/source/OSM.js"
import "./Map.css"
import TileLayer from "ol/layer/Tile"
import { fromLonLat } from "ol/proj"

const Maps = (props) => {
  const mapRef = useRef()

  const { center, zoom } = props

  useEffect(() => {
    new Map({
      target: mapRef.current.id,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    })
  }, [center, zoom])

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id='map'
    ></div>
  )
}

export default Maps
