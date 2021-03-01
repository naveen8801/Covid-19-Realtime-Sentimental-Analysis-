import { Button } from '@material-ui/core';
import React , {useState} from 'react';
import styles from './Form_user.module.css';
import TwitterIcon from '@material-ui/icons/Twitter';
import TextField from '@material-ui/core/TextField';


function Form_user({sumbitted}) {

    const [inputvalue, setinputvaluye] = useState("")

  return (
    <div className={styles.form}>
      <TwitterIcon className={styles.twitter_logo} />
      <form>
        <TextField
          id="outlined-basic"
          label="Type Twitter Handle"
          variant="outlined"
          className={styles.input_field}
          value={inputvalue}
          onChange={(e)=>setinputvaluye(e.target.value)}
        />
        <div className={styles.btn_div}>
          <Button variant="contained" color="primary" href="#contained-buttons" className={styles.button} onClick={()=>sumbitted(inputvalue)}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Form_user;
