import Html exposing ( Html, Attribute, div, label, text )
import Html.Events exposing ( onClick, onMouseOver )
import Html.Attributes exposing ( attribute, class, classList, style )
import Platform.Sub exposing ( Sub )

import Array exposing ( Array )

import Ports exposing ( openTab, keyPress )

main = Html.programWithFlags
    { init = init
    , update = update
    , view = view
    , subscriptions = subscriptions
    }

-- model

type alias Container =
    { name : String
    , iconUrl : String
    , colorCode : String
    , cookieStoreId : String
    }

type Direction
    = Up
    | Down

type alias Model =
    { currentIndex : Int
    , containers : Array Container
    }

type alias Flags =
    { containers : Array Container
    }

init : Model -> ( Model, Cmd Msg )
init flags =
    let
        { containers } = flags
        currentIndex = 0
    in
        ( Model currentIndex containers, Cmd.none )

-- ports


-- update

type Msg
    = Move Direction
    | Click Int
    | MouseOver Int
    | Select
    | NoOp

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        { containers, currentIndex } = model
        containersLength = Array.length containers
    in
        case msg of
            Move direction ->
                case direction of
                    Down ->
                        if (currentIndex < (containersLength - 1)) then
                            ( { model | currentIndex = currentIndex + 1 }, Cmd.none )
                        else
                            ( model, Cmd.none )
                    Up ->
                        if (currentIndex > 0) then
                            ( { model | currentIndex = currentIndex - 1}, Cmd.none )
                        else
                            ( model, Cmd.none )
            Click position ->
                ( model, openTab position )
            MouseOver position ->
                ( { model | currentIndex = position }, Cmd.none )
            Select ->
                ( model, openTab currentIndex )
            NoOp ->
                ( model, Cmd.none )
-- view

getIconStyle : String -> String -> Attribute Msg
getIconStyle iconUrl colorCode =
    let
        maskStyle = String.concat
            [ "url("
            ,  iconUrl
            ,  ") top left / contain"
            ]
    in
        style
            [ ( "mask", maskStyle )
            , ( "background", colorCode )
            ]

renderButton : Int -> Int -> Container -> Html Msg
renderButton currentIndex index container =
    let
        { name, iconUrl, colorCode, cookieStoreId } = container
        iconStyle = getIconStyle iconUrl colorCode
        indexStr = toString index
        selected = currentIndex == index
    in
        div [ classList
                [ ( "button", True )
                , ( "selected", selected )
                ]
            , attribute "data-pos" indexStr
            , onClick ( Click index )
            , onMouseOver ( MouseOver index )
            ]
            [ div [ class "icon", iconStyle ] []
            , label [ class "label" ] [ text name ]
            ]

view : Model -> Html Msg
view model =
    let
        { containers, currentIndex } = model
        buttonArray = Array.indexedMap (renderButton currentIndex) containers
    in
        div [ class "app-container" ]
            ( Array.toList buttonArray )

-- subscriptions

handleKeyPress : String -> Msg
handleKeyPress input =
    let
        _ = Debug.log "input is" input
    in
        if (input == "up") then
            Move Up
        else if (input == "down") then
            Move Down
        else if (input == "enter") then
            Select
        else
            NoOp

subscriptions : Model -> Sub Msg
subscriptions model =
    keyPress handleKeyPress

