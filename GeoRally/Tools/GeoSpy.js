import Url from '../Resources/Url'
import { connect } from 'react-redux'
import Store from '../Store/configureStore';

class GeoSpy {

    static create(screen, fct){
        ws = new WebSocket(Url.socket);
        

        ws.onmessage = (e) => {
            
            console.log(e.data);
        };
        
        ws.onopen = () => {
            console.log("openz "+screen);
            fct(true);
        }

        ws.onclose = () => {
            console.log("CLOSE "+screen);            
        }

        return ws;
    }

    static send = (ws, longitude, latitude) => {

        Store.getState()

        console.log("SENDZ");
        let userId = null;
        let userFromReducer = Store.getState().connectionReducer.lastConnectedUser;
        if(userFromReducer){
            userId = userFromReducer.id;
        }

        body = {
            longitude,
            latitude,
            admin: false,
            userId: userId
        }
        ws.send(JSON.stringify(body));
    }

}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(GeoSpy)