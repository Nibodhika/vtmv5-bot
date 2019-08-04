import React from 'react';

import './App.css';

import {Card, Accordion } from 'react-bootstrap';

import MainBar from './MainBar';
import CharacterSheet from './CharacterSheet';

class MainScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            page: "characters",
        };

        this.setPage = this.setPage.bind(this);
    }

    setPage(page){
        this.setState({page:page});
    }

    render(){

        let main_content;
        if(this.state.page === "characters"){
            main_content = <CharacterList />;
        }
        else if(this.state.page === "help"){
            main_content = <HelpPage />;
        }
        
        return (
            <>
              <MainBar setPage={this.setPage} />
              {main_content}
            </>
        );    
    }
    
}

class HelpPage extends React.Component {
    render(){
        return null;
    }
}

class CharacterList extends React.Component {

    state = {characters: []}

    componentDidMount() {
        fetch('/api/character')
            .then(res => res.json())
            .then(characters => this.setState({ characters }));
    }

    render() {

        const listItems = this.state.characters.map(
            (character) =>
                <Card key={character.name}>
                  <Accordion.Toggle as={Card.Header}
                                    variant="link"
                                    eventKey={character.id}>
                    {character.name}
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey={character.id}>
                    <Card.Body>
                      <CharacterSheet character={character} />
                    </Card.Body>
                  </Accordion.Collapse>
                  
                </Card>            
        );
        
        return (
            <Accordion>
              {listItems}
            </Accordion>
        );
    }
    
}

function App() {
    return (
        <div className="App">

          {/* <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/> */}
          
          <link
            rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />

          

          <MainScreen />
          
        </div>
    );
}

export default App;
