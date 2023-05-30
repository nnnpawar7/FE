import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../shared/context/auth-context"
import {useHttpClient} from "../../shared/hooks/http-hook"
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import PlaceList from "../components/PlaceList"

export default () => {
  const auth = useContext(AuthContext);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [rad, setRadious] = useState(100);
  const [systemSuggestion, setSystemSuggestion] = useState([])
  const {sendRequest } = useHttpClient()
  useEffect(() => {
    if(lat && lng){
      async function fetchData(){
        const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + "/places/getsuggestions",
            "POST",
            JSON.stringify({lat,lng, rad}),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
        );
        return setSystemSuggestion(responseData.data)

      }
      fetchData()
    }
}, [lat,lng, rad]);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Geolocation not supported");
  }
  async function success(position) {
    const {latitude, longitude } = position.coords;
    setLat(latitude);
    setLng(longitude)
  }

  function error(E) {
    console.log("Unable to retrieve your location", E);
  }
//   return <>{(systemSuggestion||[]).map(ss=>{return (<div key={ss._id}>{ss.title}</div>)})}</>;
return  <Box width={500} style={{margin:'0 auto', paddingTop: '20px'}}>
        <h2>Within area</h2>
      <Slider width={50}   step={10} max={500} defaultValue={50} aria-label="Default" style={{color:'yellow'}} onChange={(event, newValue)=>{setRadious(newValue)}} valueLabelDisplay="auto" />

        <PlaceList items={systemSuggestion} onDeletePlace={()=>{}} showFooter={false}/>
</Box>
};
