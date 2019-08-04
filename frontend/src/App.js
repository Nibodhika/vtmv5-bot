import React from 'react';

import './App.css';

import {Card, Accordion, Button } from 'react-bootstrap';

import MainBar from './MainBar';
import CharacterSheet from './CharacterSheet';

class MainScreen extends React.Component {

    constructor(props){
        super(props);
        
    }

    render(){
        return (
            <CharacterList />
    );    
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
                  <Card.Header>
                    <Accordion.Toggle as={Button}
                                      variant="link"
                                      eventKey={character.id}>
                      {character.name}
                    </Accordion.Toggle>
                  </Card.Header>

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

          <MainBar />

          <MainScreen />
          
        </div>
    );
}

export default App;
