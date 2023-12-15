import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ADDRESS_FIELD from '@salesforce/schema/Pharmacy__c.Address__c';
import NAME_FIELD from '@salesforce/schema/Pharmacy__c.Name';
import PHONE_FIELD from '@salesforce/schema/Pharmacy__c.Phone__c';
import NewRecordPharm from '@salesforce/apex/NewRecordPharmacy.NewRecordPharm'
import getLastFiveRecord from '@salesforce/apex/NewRecordPharmacy.getLastFiveRecord';


export default class InputFarmacia extends LightningElement {
    @track address = ADDRESS_FIELD;
    @track Name = NAME_FIELD;
    @track phone = PHONE_FIELD;
    @track list;
    @wire(getLastFiveRecord)
    wiredLastFiveRecords({ error, data }) {
        if (data) {
            this.list = data;
        } else if (error) {
            console.error('Error retrieving data:', error);
        }
    }    
    basicOBJ={
        address:this.address,
        Name:this.Name,
        phone:this.phone
        }
    setValueInputName(event){
        this.basicOBJ.Name = event.target.value;
    }
    setValueInputPhone(event){
        this.basicOBJ.phone = event.target.value;
    }
    setValueInputAddress(event){
        this.basicOBJ.address = event.target.value;
    }

    sendBasicOBJ(){
        NewRecordPharm({ basicOBJ: this.basicOBJ })
            .then(result => {
                //se il risultato  è positivo lo salvo in message
                this.message = result;
                //svuoto l'error
                this.error = undefined;
                //mi assicuro che message non è vuoto
                if (this.message !== undefined) {
                    //resetto le variabili
                    this.basicOBJ.Name = "";
                    this.basicOBJ.address = "";
                    this.basicOBJ.phone = "";
                    //mosto un messaggio di avvenuto succeso  con ShowToastEvent
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created Succesfully',
                            variant: 'success',
                        }),
                    );
                    //mosto in console per verifica il result  convertita in stringa perchè è in formato JSON
                    console.log(JSON.stringify(result));
                    console.log("result", this.message);
                }
            })
            .catch(error => {
                //vuoto message
                this.message = undefined;
                //riempio error con l'errore ricevuto 
                this.error = error;
                //mosto un messaggio di errore con messaggio il messaggio del corpo dell'errore
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Failed to Insert record',
                        message: error.body.message,
                        variant: 'error',
                    })
                )
                console.log("error", JSON.stringify(this.error))
            })

    }
    
}