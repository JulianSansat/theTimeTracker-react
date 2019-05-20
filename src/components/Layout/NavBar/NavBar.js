import React, { Component } from 'react';
import logo from '../../../assets/logo2.png';
import { Link, withRouter } from "react-router-dom";
import api from "../../../services/api";
import { logout } from '../../../services/auth';
import './NavBar.scss';

class NavBar extends Component {

    handleLogout = async e => {  
      try {
        logout();
        this.props.history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    render() {

    document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

            });
          });
        }
    });
    return (
            <nav class="navbar" role="navigation" aria-label="main navigation">
              <div class="navbar-brand">
                <a class="navbar-item" href="timetracker-logo">
                  <img src={logo}/>
                </a>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>

              <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                  <a class="navbar-item">
                    Home
                  </a>
                </div>

                <div class="navbar-end">
                  <div class="navbar-item">
                    <div class="buttons">
                      <button onClick={() => this.handleLogout()} class="button is-danger">
                        <strong>Logout</strong>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);
