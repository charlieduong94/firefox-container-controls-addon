port module Ports exposing ( openTab, keyPress )

-- outbound port
port openTab : Int -> Cmd msg

-- inbound port
port keyPress : ( String -> msg ) -> Sub msg
