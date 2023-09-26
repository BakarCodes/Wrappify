import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import superagent from 'superagent';
import toast from 'react-hot-toast';
import './Wrapped.css';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';


function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


class Callback extends React.Component {
    constructor(props) {
        super(props)
        const redirect_uri = 'http://localhost:3000/wrapped';

        var params = getHashParams();
        this.state = {
            access_token: params.access_token,
            client_id: "da420f0feb8244f4a8c20acd024a6a45",
            redirect_uri: redirect_uri,
            scope: "user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
            state: generateRandomString(16),
            loggedIn: false, // Initialize loggedIn state to false
            top_artists: [],
            top_tracks: [],
            data: [
                {
                    term: "short_term",
                    label: "Last month",
                    tracks: [],
                    artists: [],
                    genres: new Map()
                },
                {
                    term: "medium_term",
                    label: "Last 6 months",
                    tracks: [],
                    artists: [],
                    genres: new Map()
                },
                {
                    term: "long_term",
                    label: "All time",
                    tracks: [],
                    artists: [],
                    genres: new Map()
                }
            ],
            terms: [
                "short_term",
                "medium_term",
                "long_term"
            ],
            termLabels: [
                "Last month",
                "Last 6 months",
                "All time"
            ],
            colors: [
                "linear-gradient(0deg, #EC008C 0%, #FC6767 100%)",
                "linear-gradient(10.8deg, #FF6E7F 2.8%, #BFE9FF 98.38%)",
                "linear-gradient(4.8deg, #DA22FF 5.89%, #9733EE 95.62%)",
                "linear-gradient(0.03deg, #CC95C0 1.38%, #DBD4B4 50.68%, #7AA1D2 99.97%)",
                "linear-gradient(0.15deg, #E55D87 0.13%, #5FC3E4 99.88%)"
            ],
            userData: {},
            tempGenres: new Map(),
            footerHeight: 0,
            termCount: 0,
            genres: new Map(),
            validToken: true,
            loading: true,
            albumOffset: 0,
            albumContainerOffset: 0,
            // Add a new state for controlling which section to show
            showTopTracks: true,
            showTopArtists: false,
            selectedDuration: "short_term",
          };
          
      
      
      
          this.getTopItems = this.getTopItems.bind(this);
          this.getArtistInfo = this.getArtistInfo.bind(this);
          this.redirectToHome = this.redirectToHome.bind(this);
          this.updateTermCount = this.updateTermCount.bind(this);
          this.addToPlaylist = this.addToPlaylist.bind(this);
        }

    componentDidMount() {
        // add function to check if user is on mobile
        window.mobileCheck = function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        // calc footer height
        const footerHeight = document.getElementById("footer").clientHeight
        this.setState({ footerHeight: footerHeight })

        const min = Math.ceil(0)
        const max = Math.ceil(this.state.colors.length - 1)
        const colorIdx = Math.floor(Math.random() * (max - min + 1)) + min

        // set bg based on user device



        // check if user is logged in
        superagent.get(`https://api.spotify.com/v1/me`)
            .set("Authorization", "Bearer " + this.state.access_token)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    if (err.status === 429) {
                        console.log(res.headers['Retry-After'])
                        setTimeout(() => {
                            window.location.reload();
                        }, res.headers['Retry-After'] * 1000)
                    }
                } else {
                    this.setState({ userData: res.body })
                }
            })
        
        // get top tracks, artists for each term [short, medium, long]
        this.state.data.forEach((item, i) => {
            this.getTopItems("tracks", item.term, 50)
                .then((res) => {

                    if (res.status === 429) {
                        console.log(res.headers['Retry-After'])
                        setTimeout(() => {
                            window.location.reload();
                        }, res.headers['Retry-After'] * 1000)
                    } else {
                        let updatedData = new Object(this.state.data)
                        updatedData[i].tracks = res.body.items
                        this.setState({ data: updatedData })
                    }

                })
                .catch((err) => {
                    if (err.status === 401) {
                        console.log(err.status)
                        this.setState({ validToken: false })
                        this.redirectToHome()
                    }
                })

            this.getTopItems("tracks", item.term, 50, 49)
                .then((res) => {
                    if (res.status === 429) {
                        console.log(res.headers['Retry-After'])
                        setTimeout(() => {
                            window.location.reload();
                        }, res.headers['Retry-After'] * 1000)
                    } else {
                        let updatedData = new Object(this.state.data)
                        updatedData[i].tracks.push(...res.body.items.slice(1))
                        this.setState({ data: updatedData }, this.updateGenres)
                    }
                })
                .catch((err) => {
                    if (err.status === 401) {
                        console.log(err.status)
                        this.setState({ validToken: false })
                        this.redirectToHome()
                    }
                })

            this.getTopItems("artists", item.term)
                .then((res) => {
                    if (res.status === 429) {
                        console.log(res.headers['Retry-After'])
                        setTimeout(() => {
                            window.location.reload();
                        }, res.headers['Retry-After'] * 1000)
                    } else {
                        let updatedData = new Object(this.state.data)
                        updatedData[i].artists = res.body.items
                        this.setState({ data: updatedData })
                    }
                })
                .catch((err) => {
                    if (err.status === 401) {
                        console.log(err.status)
                        this.setState({ validToken: false })
                        //this.redirectToHome()
                    }
                })

        })
    }

    toggleTopTracks = () => {
        this.setState({
          showTopTracks: true,
          showTopArtists: false,
        });
      };

      toggleTopArtists = () => {
        this.setState({
          showTopTracks: false,
          showTopArtists: true,
        });
      };
    

    updateTermCount() {
        this.setState({ loading: true, termCount: this.state.termCount + 1 }, this.updateValues);
    }

    updateGenres() {
        this.state.data.forEach((item, i) => {

            item.tracks.forEach((track, j) => {

                this.getArtistInfo(track.artists[0].id)
                    .then(res => {
                        let updatedData = new Object(this.state.data)

                        res.body.genres.forEach(genre => {
                            updatedData[i].genres.set(genre, (updatedData[i].genres.get(genre) || 0) + 1)
                        })
                        const finalGenres = new Map([...updatedData[i].genres.entries()].sort((a, b) => b[1] - a[1]));
                        updatedData[i].genres = finalGenres
                        this.setState({ data: updatedData })
                    })
                    .catch(err => {
                        console.log(err)
                        if (err.status === 401) {
                            this.redirectToHome()
                        }

                    })
            })
        })
    }

    

    addToPlaylist() {
        const playlistName = this.state.data[this.state.termCount % 3].label.toLowerCase()
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        superagent.post(`https://api.spotify.com/v1/users/${this.state.userData.id}/playlists`)
            .set("Authorization", "Bearer " + this.state.access_token)
            .set('Content-Type', 'application/json')
            .send({
                name: `Your Top Tracks from ${playlistName}`,
                description: `Created on ${today}`,
                public: false
            })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                } else {

                    if (res.created === true) {

                        const trackURIs = this.state.data[this.state.termCount % 3].tracks.map((track, i) => {
                            return track.uri
                        })

                        superagent.post(`https://api.spotify.com/v1/playlists/${res.body.id}/tracks`)
                            .set("Authorization", "Bearer " + this.state.access_token)
                            .set('Content-Type', 'application/json')
                            .send(trackURIs)
                            .end((err, res) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    toast.success('Added your playlist!')
                                }
                            })
                    } else {
                        console.log("couldn't make playlist")
                        console.log(res)
                    }
                }
            })
    }

    async getArtistInfo(artistId) {
        return superagent.get(`https://api.spotify.com/v1/artists/${artistId}`)
            .set("Authorization", "Bearer " + this.state.access_token)
    }
    async getTopItems(item, term) {
        return superagent.get(`https://api.spotify.com/v1/me/top/${item}`)
            .query({ time_range: term })
            .set("Authorization", "Bearer " + this.state.access_token)
    }
    async getTopItems(item, term, limit, offset) {
        return superagent.get(`https://api.spotify.com/v1/me/top/${item}`)
            .query({ time_range: term })
            .query({ limit: limit })
            .query({ offset: offset })
            .set("Authorization", "Bearer " + this.state.access_token)
    }
    handleDurationChange = (duration) => {
        this.selectedDuration = duration;
        // Fetch and update the tracks for the selected duration
        this.getTopItems("tracks", duration, 50)
            .then((res) => {
                if (res.status === 429) {
                    console.log(res.headers['Retry-After']);
                    setTimeout(() => {
                        window.location.reload();
                    }, res.headers['Retry-After'] * 1000);
                } else {
                    const updatedData = [...this.state.data];
                    updatedData[this.state.termCount % 3].tracks = res.body.items;
                    this.setState({ data: updatedData });
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    console.log(err.status);
                    this.setState({ validToken: false });
                    this.redirectToHome();
                }
            });
            this.getTopItems("artists", duration)
            .then((res) => {
                if (res.status === 429) {
                    console.log(res.headers['Retry-After']);
                    setTimeout(() => {
                        window.location.reload();
                    }, res.headers['Retry-After'] * 1000);
                } else {
                    const updatedData = [...this.state.data];
                    updatedData[this.state.termCount % 3].artists = res.body.items;
                    this.setState({ data: updatedData });
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    console.log(err.status);
                    this.setState({ validToken: false });
                    this.redirectToHome();
                }
            });
    };
    redirectToHome() {
        if (process.env.NODE_ENV === "production") {
            window.location = "https//www.wrappify.uk/"
        } else {
            window.location = "http://localhost:3000"
        }
    }
    
    render() {
        const data = this.state.data[this.state.termCount % 3];
        
    
        const TrackTable = data.tracks.slice(0, 20).map((track, i) => {
          let artists = '';
          track.artists.forEach((artist, i) => {
            artists += i === track.artists.length - 1 ? `${artist.name}` : `${artist.name}, `;
          });
          return (
            <tr key={i}>
              <td className="table-cell">{i + 1}</td>
              <td className="table-cell">
                <img alt={i} src={track.album.images[2].url} className="table-image" />
              </td>
              <td className="table-cell">
                <h4 className='trackName'>{track.name}</h4>
                <p className='artistName'>{artists}</p>
              </td>
            </tr>
          );
        });
    
        const ArtistTable = data.artists.slice(0, 20).map((artist, i) => {
          return (
            <tr key={i}>
              <td className="table-cell">{i + 1}</td>
              <td className="table-cell">
                <img alt={i} src={artist.images[2].url} className="table-image" />
              </td>
              <td className="table-cell">
                <h4>{artist.name}</h4>
              </td>
            </tr>
          );
        });
    
        return (
          <div className="wrapped-container">
            <Sidebar
                onLogoClick={this.handleLogoClick}
                toggleTopTracks={this.toggleTopTracks}
                toggleTopArtists={this.toggleTopArtists}
            />

            <div className="sidebar">
                {/* Sidebar buttons */}
   
                
                {/* Add a "Create Playlist" button */}
                {this.state.showTopTracks && (
                    <button onClick={this.addToPlaylist}>Create Playlist</button>
                )}
            </div>
    
            <div className="content">
              {/* Conditionally rendered tables */}
              {this.state.showTopTracks && (
                <div className="top-tracks">
                  <h1>Top Tracks</h1>
                  <div className='termDates'>
                    <button onClick={() => this.handleDurationChange('short_term')}>Last Month</button>
                    <button onClick={() => this.handleDurationChange('medium_term')}>Last 6 Months</button>
                    <button onClick={() => this.handleDurationChange('long_term')}>All Time</button>
                  </div>
                  <table className='table'>
                    <thead>
                      <tr>
                      </tr>
                    </thead>
                    <tbody>
                      {TrackTable}
                    </tbody>
                  </table>
                </div>
              )}
    
              {this.state.showTopArtists && (
                <div className="top-artists">
                  <h1>Top Artists</h1>
                  <div className='termDates'>
                    <button onClick={() => this.handleDurationChange('short_term')}>Last Month</button>
                    <button onClick={() => this.handleDurationChange('medium_term')}>Last 6 Months</button>
                    <button onClick={() => this.handleDurationChange('long_term')}>All Time</button>
                  </div>
                  <table className='table'>
                    <thead>
                      <tr>
                      </tr>
                    </thead>
                    <tbody>
                      {ArtistTable}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
    
            <footer id="footer">
              <div>
                {/* Footer content */}
              </div>
            </footer>
          </div>
        );
      }
    }
    
    export default Callback;