import React from 'react';
import './Home.css'
import Navbar from '../Navbar';
import music from '../Images/Music.svg'
import visualise from '../Images/Visual.svg'

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

class Home extends React.Component {
    constructor(props){
        super(props);
        
        const redirect_uri = 'https://wrappify.uk/wrapped' 

        this.state = {
            client_id: "da420f0feb8244f4a8c20acd024a6a45",
            redirect_uri: redirect_uri,
            scope: "user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
            state: generateRandomString(16)
        }
        
        this.handleAuthClick = this.handleAuthClick.bind(this)
    }
    componentDidMount() {
        const body = document.querySelector("body")
        body.style.background = "#181818"
    }
    handleAuthClick(event) {
        var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(this.state.client_id);
            url += '&scope=' + encodeURIComponent(this.state.scope);
            url += '&redirect_uri=' + encodeURIComponent(this.state.redirect_uri);
            url += '&state=' + encodeURIComponent(this.state.state);

        event.preventDefault();
        window.location = url 
    }
    render(){
        return(
            <div>
                <div className="App">
                  <Navbar onLoginClick={this.handleAuthClick}/>
                  <section class="one">
                  <main className='testimonial-grid'>
                      <article className='testimonial'>
                      <div className='heading'>
                          <h2 className='welcomeMSG'>Get wrapped in today</h2>
                          <h3 className='subHeading'>track your spotify habits</h3>
                      </div>

                      <div className='landGridOne'>
                          <div className='personal'>
                              <p>Introducing Wrappify, putting the power of Spotify Wrapped in your hands, whenever you want it!</p>
                              <p>Say goodbye to the year-long wait and hello to instant access of your top listens, spanning up to a whole year from today!</p>
                              <p>Discover your destiny in music and dive deep into your musical journey with just a few taps.</p>
                          </div>
                          
                          <div className='musicSVG'>
                              <img src={music} alt="music" />
                          </div>
                      </div>
                      </article>
                      
                  </main>
                  </section>
                  <section class="two">
                  <main className='testimonial-grid'>
                      <article className='testimonial'>
                      <div className='headingTwo'>
                          <h2 className='topTracksMsg'>Visualise Spotify like never before!</h2>
                      </div>
                      <div className='landGridOne'>
                          <div className='visualSVG'>
                              <img src={visualise} alt="visual" />
                          </div>
                          <div className='personal'>
                              <h3>Step into the world of music data with Wrappify!</h3>
                              <p>Our app brings you a whole new level of visualization features that allow you to explore your Spotify habits in an innovative way. Gone are the days of waiting for your annual Spotify Wrapped, as Wrappify grants you instant access to your top listens.</p>
                              <p>Discover fascinating insights about your favorite artists, most-played tracks, and trending genres all in one place. Our intelligent algorithms analyze your listening patterns to generate personalized recommendations, giving you the opportunity to explore new music effortlessly.</p>
                          </div>

                      </div>
                      </article>
                      
                  </main>
                  </section>
                      {!window.localStorage.getItem("token") ?
                      <footer className="footer">
                          <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
                          <p> We are not related to Spotify AB or any of it´s partners in any way</p>
                      </footer> :
                      <footer className="footer">
                          <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
                          <p> We are not related to Spotify AB or any of it´s partners in any way</p>
                      </footer>

                      }

              </div>
                
            </div>
        )
    }
}

export default Home;