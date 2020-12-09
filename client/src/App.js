import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Homepage from "./components/homepage/Homepage";
import Header from "./components/header/Header";
import AddHabit from "./components/addHabit/addHabit";
import HabitList from "./components/habitList/HabitList";
import HabitDetails from "./components/habitDetails/HabitDetails";
import AuthService from "./services/auth.service.js";
import MyHabits from "./components/myHabit/myHabit";
import Footer from "./components/footer/Footer";

function App() {
  //is gebruiker ingelogd of niet?
  const [loggedInUser, setLoggedInUser] = useState(null);

  const service = new AuthService();

  function isAuthenticated() {
    if (loggedInUser === null) {
      service
        .isAuthenticated()
        .then((response) => {
          setLoggedInUser(response);
        })
        .catch((err) => {
          setLoggedInUser(false);
        });
    }
  }

  //verander state naar ingelogde user
  function getLoggedInUser(userObject) {
    setLoggedInUser(userObject);
  }

  isAuthenticated();

  if (loggedInUser) {
    //wel ingelogd
    return (
      <div className="content">
        <Header
          userInSession={loggedInUser}
          getLoggedInUser={getLoggedInUser}
        />

        <div>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Homepage loggedInUser={loggedInUser} />}
            />
            <Route path="/create" component={AddHabit} />
            <Route exact path="/explore" component={HabitList} />
            <Route
              exact
              path="/explore/:id"
              component={(props) => (
                <HabitDetails {...props} user={loggedInUser} />
              )}
            />
            <Route
              exact
              path="/my-habits"
              component={(props) => (
                <MyHabits {...props} loggedInUser={loggedInUser} />
              )}
            />
          </Switch>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  } else {
    //niet ingelogd
    return (
      <div className="content">
        <Header
          userInSession={loggedInUser}
          getLoggedInUser={getLoggedInUser}
        />
        <Switch>
          <Route
            exact
            path="/"
            component={() => <Homepage loggedInUser={loggedInUser} />}
          />
          <Route
            path="/signup"
            component={() => <Signup getLoggedInUser={getLoggedInUser} />}
          />
          <Route
            path="/login"
            component={() => <Login getLoggedInUser={getLoggedInUser} />}
          />
          <Route exact path="/explore" component={HabitList} />
          <Route
            exact
            path="/explore/:id"
            component={(props) => (
              <HabitDetails {...props} user={loggedInUser} />
            )}
          />
        </Switch>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
