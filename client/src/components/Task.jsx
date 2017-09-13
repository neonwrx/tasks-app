import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Button, FormGroup, Input } from 'reactstrap';
import { goalRef } from '../firebase';
const request = require('superagent');

// import PersonalTask from './PersonalTask';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      files: []
    }
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      snap.forEach(goal => {
        const { description, attached } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.task.serverKey) {
          this.setState({ description: description, attached: attached });
        }
      })
    })
  }

  editDescription() {
    const { serverKey } = this.props.task;
    goalRef.child(serverKey).update({description: this.state.description});
    this.refs.descriptionInput.value = '';
  }

  onDrop(acceptedFiles) {
    const { serverKey } = this.props.task;
    this.setState({
      files: acceptedFiles
    });
    const req = request.post('/');
      acceptedFiles.forEach(file => {
        req.attach(file.name, file);
        // this.setState({
        //   files: [...this.state.files, file.name]
        // });
      });
      req.end(function(err, resp) {
        if (err) { console.error(err); }
        return resp;
      });
    // const attachedFiles = JSON.stringify(this.state.files[0].name);
    // console.log('attachedFiles', attachedFiles);
    // goalRef.child(serverKey).update({attached: this.state.files[0]});
  }

  render() {
    console.log('files', this.state.files);
    const { name, email } = this.props.user;
    const { title, description, attached } = this.props.task;
    // console.log('task', this.props.task.title);
    // console.log('attached', this.state.attached);
    return(
      <div style={{margin: '5px'}}>
        <Link to={'/app'}><i className="fa fa-angle-double-left"></i> Back</Link>
        <h4>
          Task for <span><em>{ name }</em></span><span> ({ email })</span>
        </h4>
        <div>
          <div><strong>Task:</strong></div>
          <div>{ title }</div>
        </div>
        <FormGroup>
          {/* <Label for="descriptionText"><strong>Description:</strong></Label> */}
          <div>
            <strong>Description:</strong>
            <Button
              outline
              className="fa fa-pencil"
              color="secondary"
              size="sm"
              style={{marginLeft: '5px'}}
              onClick={this.toggle}
            >
            </Button>
          </div>
          <div><pre>{ description }</pre></div>
          <Input
            style={{marginBottom: '5px'}}
            type="textarea"
            placeholder="Enter a description"
            name="text"
            rows="5"
            ref="descriptionInput"
            value= { this.state.description }
            onChange={event => this.setState({description: event.target.value})}
          />
          <Button color="primary" onClick={()=> this.editDescription()}>Update</Button>
        </FormGroup>
        <div>
          <strong>Attached files: </strong>
          <div>
            {
              attached ?
                attached.split(",").map((file, index) => {
                  return (
                    <div key={index}>
                      <a href={__dirname + '/uploads/' + file} download>{file}</a>
                    </div>
                  )
                }) : 'No attached files'
            }
          </div>
        </div>
        <section>
          <div className="dropzone">
            <Dropzone onDrop={this.onDrop.bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>
          <aside>
            <h2>Dropped files</h2>
            <ul>
              {
                this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
              }
            </ul>
          </aside>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { goals, user } = state;
  // console.log('op',task);
  // console.log('op',ownProps);
  return{
    goals,
    user,
    task: state.goals.find(task => task.serverKey === ownProps.match.params.id)
  }
}

export default connect(mapStateToProps)(Task);
