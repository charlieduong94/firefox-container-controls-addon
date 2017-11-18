port module Ports exposing ( BrowserAction, browserAction, keyPress )

type alias BrowserAction =
    { action: String
    , tabIndex : Maybe Int
    }

-- outbound port
port browserAction : BrowserAction -> Cmd msg

-- inbound port
port keyPress : ( String -> msg ) -> Sub msg
