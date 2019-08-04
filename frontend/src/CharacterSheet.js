import React from 'react';

import {Container, Table, Accordion, Card, Button } from 'react-bootstrap';

class CharacterSheet extends React.Component {
    constructor(props){
        super(props);
    };

    build_line(elements){
        return  <SheetLine character={this.props.character}
                           elements={elements}
                           key={elements} //I'm not sure this works
                />;
    }

    build_group(name, elements){
        const body = elements.map(
            (line) => this.build_line(line)
        );

        return <SheetGroup name={name} lines={body}/>;
    }

    render(){

        return (
            <Accordion>
              {this.build_group(
                  "General",
                  [['name', 'concept', 'predator'],
                   ['player', 'ambition', 'clan'],
                   ['sire', 'desire', 'generation'],
                  ])}
              {this.build_group(
                  "Attributes",
                  [['strength', 'charisma', 'intelligence'],
                   ['dexterity', 'manipulation', 'wits'],
                   ['stamina', 'composure', 'resolve'],
                  ])}
            </Accordion>
        );
    }
};

function SheetGroup(props){
    return (
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button}
                              variant="link"
                              eventKey={props.name}>
              {props.name}
            </Accordion.Toggle>
          </Card.Header>
        <Accordion.Collapse eventKey={props.name}>
            <Card.Body>
              <Table
                bordered
                striped
              >
                <tbody>
                  {props.lines}
                </tbody>
              </Table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
    );
}

function SheetLine(props){
    const elements = props.elements.map(
        function(elem){
            if(elem)
                return <SheetElement
                         key={elem}
                         name={elem}
                         value={props.character[elem]}/>;
            else
                return <td/>;
        }
    );
    return (
        <tr>
          {elements}
        </tr>
    );

}

function SheetElement(props){
    return (
        <td>{props.name}: {props.value}</td>
    );
}

export default CharacterSheet;
