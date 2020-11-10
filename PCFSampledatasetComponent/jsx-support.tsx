import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

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
  
    children.forEach(child => appendChild(element, child) );
     
    return element;
  };
  
  const appendChild = (parent:Node, child:Array<Node>|Node|string) => {
    if (Array.isArray(child))
        child.forEach(nestedChild => appendChild(parent, nestedChild))
    else if( typeof child === 'string' ) 
        parent.appendChild(document.createTextNode(child))
    else if( typeof child === 'object')
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
      <h2>TSX</h2>
      <p>PCFSampledatasetComponent</p>
      <table>

      </table>
    </div> 
  
  export const updatedContent = ( params:{ update:number, dataSet:ComponentFramework.PropertyTypes.DataSet } )  => {

    let drawTableContent

    if( !params.dataSet ) {

      drawTableContent = () =>  
        <table>
          <tr>                  
            <td>NO DATA PRESENT!</td>
          </tr>
        </table>
    }
    else {
      const ds = params.dataSet

      drawTableContent = () =>  
        <table>
          <thead>
          <tr>
            <th>ID |</th>
            {
              ds.columns.map( (c,i) => <th>{`${c.displayName} |`}</th> )
            }
          </tr>
          </thead>
          <tbody>
            {
              ds.sortedRecordIds.map( (id,i) => {
                const recordId = ds.sortedRecordIds[i];
                return ds.records[recordId] as DataSetInterfaces.EntityRecord;
              }).map( r => 
                <tr>
                  <td>{r.getRecordId()}</td>
                  {
                    ds.columns
                      .filter( c => c.name !== undefined )
                      //.map( c => <td>{ r.getValue(c.name) }</td> )
                      .map( c => <td>{ c.name }</td> )
                    }
                </tr>
              )
            }
          </tbody>
        </table>
    }

    return   <div>
              <h2>TSX</h2>
              <p>{ `PCFSampledatasetComponent ${params.update}` }</p>         
              { drawTableContent() }
            </div>
  }

