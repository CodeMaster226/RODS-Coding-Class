//Library Imports
import csvEnergyDrink from "./data.csv?raw"; //Raw CSV data file
import Papa from "papaparse"; //External library used for reading CSVs
import { useState } from "react"; //State allows us to update UI when data changes
import "./App.css"; //Use our style file
import logo from "./CaffeineScanLogo.jpg"; //Use our logo file

//Drink,Brand Owner,Caffeine (mg),Flavor Range,Known For
class EnergyDrink {
  Drink!: string;
  BrandOwner!: string;
  Caffeine!: number;
  FlavorRange!: string;
  KnownFor!: string;
}

//Web App's Default Page
function App() {
  //Store the contents of the CSV
  let csvArray : any[] = Papa.parse(
    csvEnergyDrink,
    {header: true, skipEmptyLines: true}
  ).data;

  //Fill the contents of the CSV into a table variable
  let energydrinks: EnergyDrink[] = [];

  //Loop once for each data row in the CSV file
  for (let loop: number = 0; loop < csvArray.length; loop++) {
    let row = csvArray[loop];
    let energydrink = new EnergyDrink();
    energydrink.Drink = row.Drink;
    energydrink.BrandOwner = row["Brand Owner"];
    energydrink.Caffeine = Number(row["Caffeine (mg)"]);
    energydrink.FlavorRange = row["Flavor Range"];
    energydrink.KnownFor = row["Known For"];
    energydrinks.push(energydrink);
  }

  // Filter & Comparison State Variables
  let [searchTerm, setSearchTerm] = useState("");
  let [selectedBrand, setSelectedBrand] = useState("");
  let [caffeineFilter, setCaffeineFilter] = useState("");
  let [showFilters, setShowFilters] = useState(false);
  let [compareList, setCompareList] = useState<EnergyDrink[]>([]);

  let uniqueBrands = Array.from(new Set(energydrinks.map(d => d.BrandOwner)));
  let activeFilterCount = (selectedBrand !== "" ? 1 : 0) + (caffeineFilter !== "" ? 1 : 0);

  let handleReset = () => {
    setSelectedBrand("");
    setCaffeineFilter("");
    setSearchTerm("");
    setCompareList([]);
  };

  // Safe check for duplicates and strict toggle logic
  let handleCheckboxChange = (drink: EnergyDrink) => {
    let alreadyExists = compareList.some(d => d.Drink === drink.Drink);

    if (alreadyExists) {
      // Remove if already selected
      setCompareList(compareList.filter(d => d.Drink !== drink.Drink));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, drink]);
      } else {
        // If 2 already selected, replace the oldest one
        setCompareList([compareList[1], drink]);
      }
    }
  };

  // Filter drinks
  let filteredDrinks = energydrinks.filter(d => {
    let query = searchTerm.toLowerCase();
    let matchesSearch = 
      d.Drink.toLowerCase().includes(query) ||
      d.BrandOwner.toLowerCase().includes(query) ||
      d.FlavorRange.toLowerCase().includes(query) ||
      d.KnownFor.toLowerCase().includes(query) ||
      d.Caffeine.toString().includes(query);

    let matchesBrand = selectedBrand === "" || d.BrandOwner === selectedBrand;
    let matchesCaffeine = true;
    if (caffeineFilter === "low") matchesCaffeine = d.Caffeine <= 100;
    else if (caffeineFilter === "medium") matchesCaffeine = d.Caffeine > 100 && d.Caffeine <= 200;
    else if (caffeineFilter === "high") matchesCaffeine = d.Caffeine > 200;

    return matchesSearch && matchesBrand && matchesCaffeine;
  });

  //UI
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', padding: '0 20px' }}>
        <img src={logo} style={{ width: '200px', height: 'auto' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <label style={{ color: '#CCFF00', marginRight: '8px' }}>Search: </label>
              <input 
                style={{fontSize: '20px', padding: '5px', width: '300px'}}
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Type to search..."
              />
            </div>

            {/* Filter Icon Button */}
            <div 
              onClick={() => setShowFilters(!showFilters)}
              style={{ 
                position: 'relative',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '8px',
                border: '1px solid #CCFF00',
                borderRadius: '8px',
                backgroundColor: showFilters ? '#1e232d' : 'transparent',
                height: '40px',
                width: '40px',
                boxSizing: 'border-box'
              }}
              title="Filter"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <circle cx="10" cy="6" r="2.5" fill="#121418" stroke="#CCFF00" strokeWidth="2.5"></circle>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <circle cx="16" cy="12" r="2.5" fill="#121418" stroke="#CCFF00" strokeWidth="2.5"></circle>
                <line x1="4" y1="18" x2="20" y2="18"></line>
                <circle cx="8" cy="18" r="2.5" fill="#121418" stroke="#CCFF00" strokeWidth="2.5"></circle>
              </svg>

              {activeFilterCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  backgroundColor: '#CCFF00', color: '#121418',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '11px', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {activeFilterCount}
                </span>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {showFilters && (
            <div style={{ 
              display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center',
              padding: '12px', border: '1px solid #2D3748', borderRadius: '8px',
              background: '#1a1d24', marginTop: '15px'
            }}>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="" disabled>Select Brand</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              <select value={caffeineFilter} onChange={(e) => setCaffeineFilter(e.target.value)}>
                <option value="" disabled>Select Caffeine Level</option>
                <option value="low">Low (≤ 100mg)</option>
                <option value="medium">Medium (101 - 200mg)</option>
                <option value="high">High (200mg+)</option>
              </select>

              <button 
                onClick={handleReset}
                style={{
                  backgroundColor: 'transparent', border: '1px solid #ff4d4d',
                  color: '#ff4d4d', padding: '4px 8px', borderRadius: '4px',
                  cursor: 'pointer', fontSize: '12px'
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div style={{ width: '200px' }}></div>
      </div>

      {/* Comparison Panel */}
      {compareList.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#1a1d24',
          border: '1px solid #CCFF00',
          borderRadius: '10px',
          padding: '15px',
          margin: '20px auto',  
          maxWidth: '800px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ color: '#CCFF00', fontWeight: 'bold' }}>
              ({compareList.length}/2 selected for compare) {compareList.length === 1 ? '- Select one more drink' : ''}
            </span>
            <button 
              onClick={() => setCompareList([])}
              style={{ 
                background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', 
                borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '12px' 
              }}
            >
              Clear Selection
            </button>
          </div>

          {compareList.length === 2 && (
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', borderTop: '1px solid #2D3748', paddingTop: '12px' }}>
              {compareList.map((drink, index) => (
                <div key={index} style={{ textAlign: 'left', color: '#FFF', flex: 1, padding: '0 15px' }}>
                  <h3 style={{ color: '#CCFF00', margin: '0 0 8px 0' }}>{drink.Drink}</h3>
                  <p style={{ margin: '4px 0' }}><b>Brand:</b> {drink.BrandOwner}</p>
                  <p style={{ margin: '4px 0' }}><b>Caffeine:</b> {drink.Caffeine} mg</p>
                  <p style={{ margin: '4px 0' }}><b>Flavors:</b> {drink.FlavorRange}</p>
                  <p style={{ margin: '4px 0' }}><b>Known For:</b> {drink.KnownFor}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', color: '#888', margin: '15px 0 5px 0', fontSize: '14px' }}>
        Showing <span style={{ color: '#CCFF00', fontWeight: 'bold' }}>{filteredDrinks.length}</span> of {energydrinks.length} drinks
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '80px', verticalAlign: 'middle', padding: '12px' }}>Compare</th>
              <th style={{ verticalAlign: 'middle', padding: '12px' }}>Drink</th>
              <th style={{ verticalAlign: 'middle', padding: '12px' }}>Brand Owner</th>
              <th style={{ verticalAlign: 'middle', padding: '12px' }}>Caffeine (mg)</th>
              <th style={{ verticalAlign: 'middle', padding: '12px' }}>Flavor Range</th>
              <th style={{ verticalAlign: 'middle', padding: '12px' }}>Known For</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrinks.map((p, loop) => {
              let isChecked = compareList.some(d => d.Drink === p.Drink);
              return (
                <tr key={loop} className="drink-row">
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px' }}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(p)}
                      style={{ cursor: 'pointer', accentColor: '#CCFF00', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '12px' }}>{p.Drink}</td>
                  <td style={{ verticalAlign: 'middle', padding: '12px' }}>{p.BrandOwner}</td>
                  <td style={{ verticalAlign: 'middle', padding: '12px' }}>{p.Caffeine}</td>
                  <td style={{ verticalAlign: 'middle', padding: '12px' }}>{p.FlavorRange}</td>
                  <td style={{ verticalAlign: 'middle', padding: '12px' }}>{p.KnownFor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form>
  )
} 

export default App;