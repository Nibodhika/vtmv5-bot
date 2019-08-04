import React from 'react';

import {Table, Accordion, Card, Badge } from 'react-bootstrap';

class CharacterSheet extends React.Component {

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

    disciplines_group(){
        return null;
        const body = this.props.character.disciplines.map(
            (discipline) => this.build_group(discipline)
        );
        return body;
    }

    render(){

        return (
            <>
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
              {/*TODO This should not be hardcoded in case of home-rules skills*/}
              {this.build_group(
                  "Skills",
                  [['athletics', 'animal_ken', 'academics'],
                   ['brawl', 'etiquette', 'awareness'],
                   ['craft', 'insight', 'finance'],
                   ['drive', 'intimidation', 'investigation'],
                   ['firearms', 'leadership', 'medicine'],
                   ['larceny', 'performance', 'occult'],
                   ['melee', 'persuasion', 'politics'],
                   ['stealth', 'streetwise', 'science'],
                   ['survival', 'subterfuge', 'technology'],
                  ])},
              {this.disciplines_group()}
            </>
        );
    }
};

function SheetGroup(props){
    return (
        <Accordion defaultActiveKey={props.name}>
        <Card border='danger'>
          <Accordion.Toggle as={Card.Header}
                            eventKey={props.name}>
            {props.name}
          </Accordion.Toggle>
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
        </Accordion>
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
    var value = props.value || '-';
    return (
        <td>
          {props.name} <Badge pill variant="dark">{value}</Badge>
        </td>
    );
}

export default CharacterSheet;
