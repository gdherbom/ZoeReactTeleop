//'ws://192.168.175.40:9090'
//'ws://192.168.148.40:9090'
//'ws://192.168.98.40:9090'
//'ws://192.168.107.78:9090'

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';

import {ros} from './robot';

import ROSLIB from 'roslib';

import Slider from '@react-native-community/slider';

const App = () => {
  //Status of connexion
  const [status, setStatus] = useState('Disconnected');

  //Name of button
  const [titlebutton, setTittlebutton] = useState('Connexion');

  // Switch mode Turtle or Zoe
  const [turtlemode, setTurtlemode] = useState(true);

  // Cursor const for Steering
  const [steeringcursor, setSteeringCursor] = useState(0);

  // Cursor const for Accelerator
  const [acceleratorcursor, setAcceleratorCursor] = useState(0);

  // Change mode between turtle mode or zoe mode
  const toggleSwitch = () => setTurtlemode(previousState => !previousState);

  // Connect to the rosbridge server
  const connection = () => {
    ros.connect();
    // Log a message when the connection is ok
    ros.on('connection', function () {
      console.log('Connected to websocket server.');
      setStatus('Connected');
      setTittlebutton('Deconnexion');
    });

    // Log a message when the connection is closed
    ros.on('close', function () {
      console.log('Connection to rosbridge closed.');
      setStatus('Disconnected');
      setTittlebutton('Connexion');
    });

    // Log a message when an error occurs
    ros.on('error', function (error) {
      console.log('Error connecting to rosbridge: ', error);
      setStatus('Erreur');
      setTittlebutton('Connexion');
    });
  };

  /**
   * Fonction pour faire aller le robot dans une direction a une certaine vitesse
   * @param {Float} vitesse en km/h
   * @param {Float} steering angle en degre negative droite et positive gauche
   *
   */

  var acceleration = 0;

  const Goto = (vitesse, steering) => {
    var cmdVelZoe = new ROSLIB.Topic({
      ros: ros,
      name: '/zoe/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });

    var cmdVelTurtle = new ROSLIB.Topic({
      ros: ros,
      name: '/turtle1/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });

    if (acceleration < vitesse) {
      setTimeout(() => {
        acceleration++;
        console.log('a: ' + acceleration, ' ', vitesse);
      }, 3000);
    } else if (acceleration > vitesse) {
      do {
        acceleration--;
        console.log('b: ' + acceleration);
      } while (acceleration < vitesse);
    } else if (vitesse == 0) {
      return 0;
    }
    var twist = new ROSLIB.Message({
      linear: {
        x: acceleration,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: steering,
      },
    });

    if (turtlemode) {
      cmdVelTurtle.publish(twist);
    } else {
      cmdVelZoe.publish(twist);
    }
    console.log(acceleration);
  };

  var frein = acceleratorcursor;

  const onBrakePress = () => {
    console.log('START');
    if (frein > 0) {
      setTimeout(() => {
        Goto(frein, steeringcursor);
        frein--;
        console.log('frein:' + frein);
      }, 5000);
    }
    console.log('fini');
  };

  const onForwardPress = () => {
    console.log('F');
    if (steeringcursor < 0) {
      console.log('L');
    } else if (steeringcursor > 0) {
      console.log('R');
    }
    for (let i = 0; i < acceleratorcursor; i++) {
      Goto(i, steeringcursor);
    }
  };

  let timer;

  const onHoldingForwardPress = () => {
    timer = setInterval(() => {
      console.log('F');
      Goto(acceleratorcursor, setSteeringCursor);
    }, 1000);
  };

  const onPressOut = () => {
    clearTimeout(timer);
  };

  const deconnection = () => {
    ros.close();
  };

  return (
    <>
      <View style={styles.ConnectButtons}>
        <Text>Status: {status}</Text>

        <Text>Zoe</Text>

        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={turtlemode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={turtlemode}
        />
        <Text>Turtle</Text>

        <TouchableOpacity
          onPress={titlebutton === 'Connexion' ? connection : deconnection}>
          <Text>{titlebutton}</Text>
        </TouchableOpacity>
      </View>

      <Text>Volant</Text>

      <View style={styles.Slider}>
        <Slider
          style={{width: 250, height: 40, textAlign: 'center'}}
          minimumValue={-90}
          maximumValue={90}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={value => setSteeringCursor(value)}
          value={0}
          step={1}
        />
        <Text>{steeringcursor}</Text>

        <Text>Accélérateur</Text>
        <Slider
          style={{width: 250, height: 40, textAlign: 'center'}}
          minimumValue={0}
          maximumValue={50}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={value => setAcceleratorCursor(value)}
          value={0}
          step={1}
        />

        <Text>{acceleratorcursor}</Text>
      </View>
      <View style={styles.Container}>
        <TouchableOpacity
          onPress={onForwardPress}
          onPressIn={onHoldingForwardPress}
          onPressOut={onPressOut}
          style={styles.FBbuttons}>
          <Text>Avancer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBrakePress}
          onLongPress={onBrakePress} 
          style={styles.FBbuttons}>
          <Text>Freiner</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  ConnectButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  FBbuttons: {
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '20%',
    marginHorizontal: '40%',
  },
  LRbuttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '20%',
    width: '60%',
  },
  Lbutton: {
    backgroundColor: 'blue',
    width: '30%',
    alignItems: 'center',
  },
  Rbutton: {
    backgroundColor: 'blue',
    width: '30%',
    alignItems: 'center',
  },
  Slider: {
    flex: 1,
  },
});

export default App;
