# Stage d'Obrayan React Native android pour la Zoé

Création d'un nouveau projet :

```
npx react-native init "[nom du projet]"
```

Dans le dossier du projet :
```
npm install
```

Pour installer la dernière version de nodejs avec NVM :
https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04/

Lancer l'appli dans le dossier RosProject taper : 

```

npm start

```

cliquer sur 'a' pour lancer l'application vers le téléphone. 

Installer le SDK Android pour éviter cette erreur : 

```
more local.properties
## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For customization when using a Version Control System, please read the
# header note.
#Wed Jan 11 13:55:10 CET 2023
sdk.dir=/home/pretil/Android/Sdk
```

Download Android Studio here : 
https://developer.android.com/studio

Installation : 
https://developer.android.com/studio/install?hl=fr

Accélération matériel pour l'émulateur Android : developer.android.com/r/studio-ui/emulator-kvm-setup.html 

Ensuite créer un projet vide dans Android Studio. 

Configurer les variables d'environnement : 
```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```


## divers 

Au préalable activer les developer tools sur le téléphone Android (options de développement, débogage USB)

différence entre react.js et react native :

https://www.cognitiveclouds.com/insights/what-is-the-difference-between-react-js-and-react-native


Script pour automatiser le lancement de la partie ROS sur le PC de développement linux : 

launch_ros_react.sh

Pour de plus amples informations sur l 'installation de l'environement :

https://reactnative.dev/docs/environment-setup
