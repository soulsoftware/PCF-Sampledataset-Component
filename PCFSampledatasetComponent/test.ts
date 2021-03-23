

/** @jsx createElement */
import { initialContent } from './jsx-support'


window.addEventListener( 'load',  (ev) => {
    const container = document.getElementById('container')

    console.log(container) 
    
	const element = document.createElement( 'div')

	const content = element.appendChild( initialContent() )		

	container!.style.backgroundColor = 'yellow'
    
    container?.appendChild( element )
	
})

