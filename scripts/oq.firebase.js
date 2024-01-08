/**
 * Author: Didier Leonard-Jean Charles
 * Date Created: Nov 29, 2016
 *
 * @name: oq.firebase.js
 * @owner: OptiQly
 * @purpose: OQ GCP Firebase instance
 */

// Initialize Firebase
firebase.initializeApp(firebase_config);

var sendToFirebase = function(data){
    console.log(data);
    var firebaseRef = firebase.database().ref();
    var child = data.dob.toString();

    firebaseRef.child(child).set(data);
};