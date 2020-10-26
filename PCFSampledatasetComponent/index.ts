import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class PCFSampledatasetComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged: () => void;

	private _element: HTMLDivElement;
	private _title: HTMLParagraphElement;
	private _table: HTMLTableElement;
	private _update =  0;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		
		context.mode.trackContainerResize(true)

		this._notifyOutputChanged = notifyOutputChanged
		
		this._element = document.createElement('div')
		this._title = document.createElement('p')
		this._title.innerText = `PCFSampledatasetComponent`	
		this._table = document.createElement('table')

		this._element.appendChild( this._title );
		this._element.appendChild( this._table );


		container.style.backgroundColor = 'yellow'
		container.appendChild( this._element )
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._title.innerText = `PCFSampledatasetComponent ${++this._update}`

		if (!context.parameters.sampleDataSet.loading) {
			this.updateDataset( context.parameters.sampleDataSet  );
		}
		this._notifyOutputChanged()

	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	private clearTable() {
		while (this._table.firstChild) {
			this._table.removeChild(this._table.firstChild);
		}
	}
	private updateDataset( dataSet:ComponentFramework.PropertyTypes.DataSet ) {

		if( !dataSet ) {
			console.log( 'DATASET IS NULL!')
			return
		}

		this.clearTable()

		const TAG = <K extends keyof HTMLElementTagNameMap>(tagName:K) => 
			(text:string) => {
				let th = document.createElement(tagName); 
				th.innerText = text; 
				return th
			}
		
		const TH = TAG('th')
		const TD = TAG('td')

		//
		// TABLE HEADER
		//
		const trow = document.createElement( 'tr')	

		trow.appendChild( TH('ID') )

		dataSet.columns.map( (c,i) => TH( `${i} | ${c.displayName}`)).forEach( c => trow.appendChild(c) )

		const thead = document.createElement( 'thead'); thead.appendChild( trow )
		this._table.appendChild(thead)

		//
		// TABLE BODY
		//
		const tbody = document.createElement( 'tbody')

		const records = dataSet.sortedRecordIds.map( (id,i) => {
			const recordId = dataSet.sortedRecordIds[i];
			return dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
		}).forEach( r => {
			const tr =  document.createElement('tr'); 

			tr.appendChild(TD( r.getRecordId() ))
			
			dataSet.columns.filter( c => c.name !== undefined ).forEach( c =>			
				tr.appendChild( TD( String(r.getValue(c.name)) ) )
			)

			tbody.appendChild( tr )
		})

		this._table.appendChild(tbody)
	}
}