module Main exposing (..)

import Html exposing ( Html, Attribute, div, hr, label, text )
import Html.Events exposing ( onClick, onMouseOver )
import Html.Attributes exposing ( attribute, class, classList, style )
import Platform.Sub exposing ( Sub )
import List
import Ports exposing ( BrowserAction, browserAction, keyPress )

main =
    Html.programWithFlags
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
    , containers : List Container
    }

type alias Flags =
    { containers : List Container
    }

init : Model -> ( Model, Cmd Msg )
init flags =
    let
        { currentIndex, containers } =
            flags
    in
        ( Model currentIndex containers, Cmd.none )

-- update

type Msg
    = Move Direction
    | Click Int
    | MouseOver Int
    | Select
    | NoOp

openTab : Int -> BrowserAction
openTab tabIndex =
    BrowserAction "OpenTab" ( Just tabIndex )

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        { containers, currentIndex } =
            model

        containersLength =
            List.length containers
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
                            ( { model | currentIndex = currentIndex - 1 }, Cmd.none )
                        else
                            ( model, Cmd.none )

            MouseOver position ->
                ( { model | currentIndex = position }, Cmd.none )

            Click position ->
                ( model, browserAction (openTab position) )

            Select ->
                ( model, browserAction (openTab currentIndex) )

            NoOp ->
                ( model, Cmd.none )

-- view

getIconStyle : String -> String -> Attribute Msg
getIconStyle iconUrl colorCode =
    let
        maskStyle =
            String.concat
                [ "url("
                , iconUrl
                , ") top left / contain"
                ]
    in
        style
            [ ( "mask", maskStyle )
            , ( "background", colorCode )
            ]

renderButton : Int -> Int -> Container -> Html Msg
renderButton currentIndex index container =
    let
        { name, iconUrl, colorCode, cookieStoreId } =
            container

        iconStyle =
            getIconStyle iconUrl colorCode

        indexStr =
            toString index

        selected =
            currentIndex == index
    in
        div
            [ classList
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
        { containers, currentIndex } =
            model

        renderCurrentButton =
            renderButton currentIndex

        separator =
            hr [ class "separator" ] []

        buttonList = containers
            |> List.indexedMap renderCurrentButton
            |> List.intersperse separator
    in
        div [ class "app-container" ]
            buttonList

-- subscriptions

handleKeyPress : String -> Msg
handleKeyPress input =
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
