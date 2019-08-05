import React from 'react';

import {Breadcrumb, Button, Card, Nav, Tabs, Tab, Row, Col } from 'react-bootstrap';

class HelpPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            levels: [],
            currentLevel: -1,
            content: []
        };

        this.addLevel = this.addLevel.bind(this);
    }

    addLevel(new_level){
        var self = this;
        var contents = this.state.content.slice(0, self.state.currentLevel + 1);
        var levels = this.state.levels.slice(0, self.state.currentLevel + 1);
        levels.push(new_level);
        var url = '/api/' + levels.join('/');
        fetch(url)
            .then(function (response) {
                if(response.status === 200){
                    response.json()
                        .then(function(content){
                            contents.push(content);
                            self.setState({
                                content: contents,
                                levels: levels,
                                currentLevel: self.state.currentLevel + 1
                            });
                        }
                              
                             );
                    
                } else{
                    self.setState({content:null});
                }
            });
    }
    
    componentDidMount() {
        this.addLevel("help");
    }


    goBackTo(level){
        this.setState({
            currentLevel: level
        });
    }
    
    render(){
        let content;
        if(this.state.content)
            content = this.state.content[this.state.currentLevel];
        var crumbs = this.state.levels.map(
            (elem, i) => <Breadcrumb.Item
                           key={elem}
                           onClick={() => this.goBackTo(i)}
                         >
                           {elem}
                         </Breadcrumb.Item>
        );
        
        return (
            <>
              <Breadcrumb>
                {crumbs}
              </Breadcrumb>
              <HelpDisplay
                help={content}
                select={this.addLevel}
              />
            </>
        );
    }
}

function HelpSpecification(props){
    return (
        <Button
          variant="primary"
          size="lg"
          block
          onClick={() => props.onClick(props.elem)}
        >
          {props.elem}
        </Button>
    );
}

function ListSpecifications(props) {
    var out = props.specifications.map(
            (elem) => <HelpSpecification
                            key={elem}
                            elem={elem}
                            onClick={props.onClick}
          />
            
    );

    return (
        <Card.Text>
        {out}
    </Card.Text>
    );
}

function MapSpecifications(props) {
    var navigation = [];
    var specifications = [];
    var defaultKey = null;
    for(var k in props.specifications) {       
        if(defaultKey === null)
            defaultKey = k;
        navigation.push(<Nav.Item>
                        <Nav.Link eventKey={k}>{k}</Nav.Link>
                        </Nav.Item>);
        var s = props.specifications[k].map(
            (elem) => <HelpSpecification
                        key={elem}
                        elem={elem}
                        onClick={props.onClick}
                      />
        );
        specifications.push(
            <Tab.Pane eventKey={k}>
              {s}
            </Tab.Pane>
        );

    }
    console.log(defaultKey)
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey={k}>
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {navigation}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {specifications}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
}

function HelpDisplay(props){
    if(! props.help)
        return null;
    
    var content = props.help.text;
    var specifications = null;
    var navigation = null;
    
    if(props.help.specifications){
        if(Array.isArray(props.help.specifications)){
            specifications = <ListSpecifications
                                   specifications={props.help.specifications}
                                   onClick={props.select}/>;
        } else {
            specifications = <MapSpecifications
                               specifications={props.help.specifications}
                               onClick={props.select}/>;
        }
    }
    
    return (
        <Card>
          <Card.Header>
          {/*   <Nav variant="pills" defaultActiveKey="#first"> */}
          {/*     <Nav.Item> */}
          {/*       <Nav.Link href="#first">Active</Nav.Link> */}
          {/*     </Nav.Item> */}
          {/*     <Nav.Item> */}
          {/*       <Nav.Link href="#link">Link</Nav.Link> */}
          {/*     </Nav.Item> */}
            {/*   </Nav> */}
        {content}
          </Card.Header>
          <Card.Body>

    
          {/*   <Card.Title> */}
          {/*     {content} */}
          {/*   </Card.Title> */}
          {/*   <Card.Text> */}
              {specifications}
          {/*   </Card.Text> */}
          </Card.Body>

        </Card>
    );
}

export default HelpPage;
