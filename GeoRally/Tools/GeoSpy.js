import Url from '../Resources/Url'
import { connect } from 'react-redux'
import Store from '../Store/configureStore';

class GeoSpy {

    static create(fct){
        ws = new WebSocket(Url.socket);
        

        ws.onmessage = (e) => {
                        
        };
        
        ws.onopen = () => {            
            fct(true);
        }

        ws.onclose = () => {            
        }

        return ws;
    }

    static send = (ws, longitude, latitude) => {

        Store.getState()
             
        let userFromReducer = Store.getState().connectionReducer.lastConnectedUser;

        if(userFromReducer){
            body = {
                longitude,
                latitude,
                admin: false,
                userId: userFromReducer.id
            }
            ws.send(JSON.stringify(body));
        }

        
    }

}

const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(GeoSpy)