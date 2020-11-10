
type Props = any
type Children = Array<Node>
type Listener = ( ev:any ) => void 
type Tag = string | (( props: Props|null, ...children: Children ) => any)

/**
 * 
 * @param tag 
 * @param props 
 * @param children 
 */
function createElement(tag:Tag, props: Props, ...children: Children):HTMLElement {

    if (typeof tag === "function") return tag(props, ...children);
    
    const element = document.createElement(tag);
  
    Object.entries(props || {}).forEach(([name, value]) => {

      if (name.startsWith("on") && name.toLowerCase() in window)    
        element.addEventListener(name.toLowerCase().substr(2), value as Listener);
      else 
        element.setAttribute(name, String(value))
    });
  
    children.forEach(child => {
      appendChild(element, child);
    });
  
    return element;
  };
  
  const appendChild = (parent:Node, child:Array<Node>|Node|string) => {
    if (Array.isArray(child))
        child.forEach(nestedChild => appendChild(parent, nestedChild))
    else if( child === 'string' ) 
        parent.appendChild(document.createTextNode(child))
    else 
        parent.appendChild(child as Node);
  };
  
  /**
   * 
   * @param props 
   * @param children 
   */
  const createFragment = (props: Props|null, ...children: Children) => {
    return children;
  };
  
  //
  //
  //

  export const initialContent = () =>  
    <div>
      <p>PCFSampledatasetComponent</p>
      <table>

      </table>
    </div> 
  
  export const updatedContent = ( update:number )  =>  
    <div>
      <p>PCFSampledatasetComponent {++update}</p>
    </div>

