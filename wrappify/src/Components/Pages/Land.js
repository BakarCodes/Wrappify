import React from 'react';


function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function base64URLEncode(data) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(data)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}



class Land extends React.Component {
    constructor(props){
        super(props);

        let redirect_uri = ""
        if(process.env.NODE_ENV === 'production') {
            redirect_uri = 'https://www.wrappify.uk/home'
        } else {
            redirect_uri = 'http://localhost:3000/home'
        }
        this.state = {
            client_id: "da420f0feb8244f4a8c20acd024a6a45",
            redirect_uri: redirect_uri,
            scope: "user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
            state: generateRandomString(16)
        }
        
        this.handleAuthClick = this.handleAuthClick.bind(this)
    }
    componentDidMount() {
        const body = document.querySelector("body");
        body.style.background = "#181818";

        // Check if the URL contains the authorization code
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            // Perform the redirect to the home page
            window.location.href = process.env.NODE_ENV === 'production'
                ? 'https://www.wrappify.uk/home'
                : 'http://localhost:3000/home';
        }
    }

    handleAuthClick(event) {
        const codeVerifier = generateRandomString(128); // Generate a random string as the code verifier
        const codeChallenge = base64URLEncode(sha256(codeVerifier)); // Hash the code verifier and encode the result
    
        // Store the code verifier in local storage
        localStorage.setItem('code_verifier', codeVerifier);
    
        const url = 'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + encodeURIComponent(this.state.client_id) +
            '&scope=' + encodeURIComponent(this.state.scope) +
            '&redirect_uri=' + encodeURIComponent(this.state.redirect_uri) +
            '&state=' + encodeURIComponent(this.state.state) +
            '&code_challenge_method=S256' +
            '&code_challenge=' + codeChallenge;
    
        event.preventDefault();
        window.location = url;
    }
    

    render() {
        return (
            <div>
                <div className="header-container">
                    <p className="header-small">YOUR</p>
                    <h1 className="header">Wrapped,<br />Whenever</h1>
                </div>
                <div className="d-flex flex-row justify-content-center fixed-bottom">
                    <button onClick={this.handleAuthClick} className="login-btn">Login with Spotify</button>
                </div>
            </div>
        );
    }
}

export default Land;