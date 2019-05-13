import Store from "../Store/configureStore.js";
import fr from "./fr.json";
import en from "./en.json";



export default function Strings(value, value2)
{
    let lang = Store.getState().connectionReducer.locale;
    let file;

    if (lang === "fr")
    {
        file = fr;
    }
    else if (lang === "en")
    {
        file = en;
    }
    else
    {
        file = fr;
    }
    return file[value][value2]
}

export function getImage()
{
    let lang = Store.getState().connectionReducer.locale;
    
    if (lang === "fr")
    {
        file = require('./Images/finish_figure_fr.png')
    }
    else if (lang === "en")
    {
        file = require('./Images/finish_figure_en.png')
    }
    else if (lang === "de" )
    {
        file = require('./Images/finish_figure_de.png')
    }
    return file;
}