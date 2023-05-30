import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Chatbot.css"

import axios from "axios";

export function Chip({name, onClick}){
  return (<div onClick={onClick} className="chip">{name}</div>)
}

export class DBPedia extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: true,
        result: '',
        trigger: false,
      };
  
      this.triggetNext = this.triggetNext.bind(this);
    }
  
    componentWillMount() {
      const self = this;
      const place = this.props.steps["get-recent-place"] ||'';
      const search = place.value || 'Rajkot';
  
    //   const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;
        const queryUrl = `http://127.0.0.1:8000/getrecommendation/${search}`;

        axios.get(queryUrl).then(result=>{
          self.setState({ loading: false, result: result.data });
        }).catch(e=>{
          console.log('error', e);
          self.setState({ loading: false, result: [] });
        })
    }
  
    triggetNext() {
      this.setState({ trigger: true }, () => {
        this.props.triggerNextStep();
      });
    }
    async getTouristPlaces(city){
      const touristPlacesData = await axios.post("http://localhost:8000/getTouristPlaces", {city})
      this.props.triggerNextStep({ value: touristPlacesData.data, trigger:"print_tourist_places" });
    }
  
    render() {
      const { result } = this.state;
      return (
        <div style={{ width: '100%', paddingRight: '10px', background: 'transparent' }}>

            {(result || []).map((r)=><Chip onClick={()=>{this.getTouristPlaces(r)}} name={r} key={r}></Chip>)}
      </div>
      );
    }
  }
  
  DBPedia.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
  };
  
  DBPedia.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
  };