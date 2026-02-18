'use client';

import { useState } from "react"; 

// @PostMapping("/register")
//     public ResponseEntity<User> registerUser(@RequestBody User user) {
//         User savedUser = userService.registerUser(user);
//         // avoid returning password
//         savedUser.setPassword(null);
//         return ResponseEntity.ok(savedUser);
//     }

import React from 'react'

const Register = () => {
  return (
    <>
    <div>
      <h1>Register Page</h1>
      <p>This is where the registration form will go.</p>
    </div>
    </>
  )
}

export default Register; 

