import React, { Component } from 'react'
import { Link as RoutedLink } from 'react-router-dom'

const Link = (props) => {
  const to = props.to
  const children = props.children
  if (to.indexOf('://') === -1) {
    return (<RoutedLink to={to} {...props}>{children}</RoutedLink>)
  } else {
    return (<a href={to} {...props}>{children}</a>)
  }
}

export default Link
