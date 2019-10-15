import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/Alltypes.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    """Return the homepage."""
    return render_template("dashboard.html")

@app.route("/data")
def get_data():

  engine = create_engine("sqlite:///db/Alltypes.sqlite")
  conn = engine.connect()
  
  sql = f"select * from Alltypes"
  Alltypes_df = pd.read_sql(sql, conn)
  conn.close()
  return Alltypes_df.to_json(orient="records")

@app.route("/year")
def get_year():
    engine = create_engine("sqlite:///db/Alltypes.sqlite")
    conn = engine.connect()
  
    sql = f"select * from Alltypes"
    data = pd.read_sql(sql, conn)
    conn.close()
    # Return a list of the column names (sample names)
    return jsonify(list(data.columns)[2:])


@app.route("/<energy_type>/<yr>")
def select_data(energy_type, yr):
    engine = create_engine("sqlite:///db/Alltypes.sqlite")

    sql = f"select * from Alltypes"
    
    # result = engine.execute("sql statement")

    conn = engine.connect()
  
    data = pd.read_sql(sql, conn)
    conn.close()

    tmp_data = data.loc[:,['Type','State',yr]]
    
    selected_data = tmp_data[tmp_data['Type']==energy_type ]

    data = {
        "State":selected_data['State'], 
        "consumption": selected_data[yr]
    }
    print(data)

    data = pd.DataFrame(data)
    return data.to_json(orient="records")
    # return jsonify(data)
    
@app.route("/<energy_type>")
def select_data_per_state(energy_type,state='AK'):
    
    engine = create_engine("sqlite:///db/Alltypes.sqlite")
    conn = engine.connect()
  
    sql = f"select * from Alltypes"
    data = pd.read_sql(sql, conn)
    conn.close()

    tmp = data[data['Type'] == energy_type]
    selected_data = tmp[tmp['State']==state]


    return selected_data.to_json(orient="records")


if __name__ == "__main__":
    app.run(port=5008, debug=True)
