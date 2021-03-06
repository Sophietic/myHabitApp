import React, { useState, useEffect } from "react";
import "bulma/css/bulma.css";
import "./HabitDetails.css";
import MyHabitButton from ".././myHabbitButton/myHabitButton";
import HabitService from "../../services/habits.service.js";
import { Link } from "react-router-dom";


const initialState = {
  _id: " ",
  habitname: " ",
  description: " ",
  categories: " ",
};

function HabitDetails(props) {
  const [habitDetailState, setHabitDetail] = useState(initialState);

  function getOneHabit() {
    const { id } = props.match.params;
    const service = new HabitService();

    service
      .getonehabit(id)
      .then((habitFromApi) => {
        setHabitDetail(habitFromApi.data);
        
      })
      .catch((error) => console.error(error));
  }

  useEffect(getOneHabit, [props.match.params]);

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card">
              <br></br>

                <div className="card-content column is-10 is-offset-1" key={habitDetailState._id}>
                  <h3 className="title is-1 is-family-code">
                    {habitDetailState.habitname}
                  </h3>
                  <p className="content">{habitDetailState.description}                   <a className="has-text-danger" href={`${habitDetailState.science}`} target="_blank">Read the science. </a>
</p>
                  <p className="content">
                  <strong>Daily Habit:{" "}</strong> 
                  {habitDetailState.dailyhabit}</p>

                  <p className="content">
                    <strong>Category:{" "}</strong> {habitDetailState.categories}
                  </p>
           
                </div>
                <div className="card-content column is-10 is-offset-1 ">
                  <MyHabitButton
                    theHabit={habitDetailState}
                    getOneHabit={getOneHabit}
                    {...props}
                  />{" "}
                </div>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HabitDetails;
