<template></template>
<script setup>
// sphere

const vector = new THREE.Vector3();

for (let i = 0, l = objects.length; i < l; i++) {
  const phi = Math.acos(-1 + (2 * i) / l);
  const theta = Math.sqrt(l * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.sphere.push(object);
}
// helix

for (let i = 0, l = objects.length; i < l; i++) {
  const theta = i * 0.175 + Math.PI;
  const y = -(i * 8) + 450;

  const object = new THREE.Object3D();

  object.position.setFromCylindricalCoords(900, theta, y);

  vector.x = object.position.x * 2;
  vector.y = object.position.y;
  vector.z = object.position.z * 2;

  object.lookAt(vector);

  targets.helix.push(object);
}

// grid

for (let i = 0; i < objects.length; i++) {
  const object = new THREE.Object3D();

  object.position.x = (i % 5) * 400 - 800;
  object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
  object.position.z = Math.floor(i / 25) * 1000 - 2000;

  targets.grid.push(object);
}

function transform( targets, duration ) {

TWEEN.removeAll();

for ( let i = 0; i < objects.length; i ++ ) {

    const object = objects[ i ];
    const target = targets[ i ];

    new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

    new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

}

new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}
</script>
