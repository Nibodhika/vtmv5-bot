import React from 'react';

import {Breadcrumb, Button, Card } from 'react-bootstrap';

class HelpPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            levels: [],
            currentLevel: null,
            content: []
        };

        this.addLevel = this.addLevel.bind(this);
    }

    getHelp(levels){
        var self = this;
        var url = '/api/' + levels.join('/');
        console.log(url)
        fetch(url)
            .then(function (response) {
                if(response.status === 200){
                    response.json()
                        .then(function(content){
                            console.log(content)
                            var contents = self.state.content.slice(0, self.state.currentLevel + 1);
                            contents.push(content);
                            self.setState({
                                  content: contents
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

    addLevel(level){
        var levels = this.state.levels.slice(0, this.state.currentLevel + 1);
        levels.push(level);
        this.getHelp(levels);
        this.setState({
            levels: levels,
            currentLevel: levels.length -1
        });
    }

    goBackTo(level){
        console.log("Go back to " + level)
        this.setState({
            currentLevel: level
        });
    }
    
    render(){
        let content;
        if(this.state.content)
            content = this.state.content[this.state.currentLevel];
        console.log(content)
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

function HelpDisplay(props){
    if(! props.help)
        return null;
    
    var content = props.help.text;
    var specifications = "";
    
    if(props.help.specifications){
        specifications = props.help.specifications.map(
            (elem) => <HelpSpecification
                        key={elem}
                        elem={elem}
                        onClick={props.select}
                      />
            );
    }
    
    return (
        <Card>
          <Card.Body>
            <Card.Title>
              {content}
            </Card.Title>
            <Card.Text>
              {specifications}
            </Card.Text>
          </Card.Body>
        </Card>
    );
}

export default HelpPage;
