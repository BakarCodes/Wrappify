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

class Home extends React.Component { onLoginClick
    constructor(props){
        super(props);
        
        const redirect_uri = 'https://www.wrappify.uk/wrapped' 

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
        body.style.background = "#161616"
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
                        <div className='newsBox'>
                            <h5 className='newAlerts'>NEW - Create playlists based on your top listens using Wrappify</h5>
                        </div>
                            <h2 className='welcomeMSG'>Track your Spotify habits with Wrappify</h2>
                            <h4 className='subHeading'></h4>
                      </div>

                      <div className='landGridOne'>
                          <div className='personal'>
                            <p>Find out your top tracks and your top artists from last month to over a year. Create playlists with your most listened tracks.</p>
                          </div>
                          <div className='homeButtons'>
                            <div>
                            <div>
                                <button className='tryOutButton' onClick={this.handleAuthClick}>TRY WRAPPIFY NOW</button>
                            </div>
                            </div>

                          </div>
                          
                      </div>
                      </article>
                      
                  </main>
                  </section>
                  <section class="two">
                    <main className='testimonial-gridTwo'>
                        <article className='testimonial'>
                        <div className='heading'>
                            <h2 className='welcomeMSG'>What is Wrappify?</h2>
                        </div>

                        <div className='landGridTwo'>
                            <div className='personalTwo'>
                                <p>Wrappify harnesses the incredible capabilities of Spotify's APIs to provide users with a comprehensive overview of their musical preferences and listening habits. Users gain access to a wealth of valuable information about their music consumption. </p>
                            </div>
                            
                            <div className='musicSVG'>
                                <img src={music} alt="music" />
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