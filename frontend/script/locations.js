const INDIAN_LOCATIONS = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Anantapur", "Eluru", "Ongole", "Kadapa", "Chittoor", "Machilipatnam", "Tenali", "Proddatur", "Hindupur"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Roing", "Tezu", "Along", "Namsai", "Daporijo", "Khonsa"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Barpeta", "Goalpara", "Kokrajhar", "Diphu", "Haflong", "North Lakhimpur", "Sivasagar", "Mangaldoi"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Munger", "Chhapra", "Sasaram", "Hajipur", "Bettiah", "Motihari", "Samastipur", "Begusarai", "Katihar", "Nawada", "Siwan", "Madhubani"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Mahasamund", "Dhamtari", "Bhatapara"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Connaught Place", "Hauz Khas", "Lajpat Nagar", "Pitampura", "Janakpuri", "Greater Kailash", "Patel Nagar", "Kashmere Gate", "Preet Vihar"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Valpoi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Gandhinagar", "Nadiad", "Morbi", "Bharuch", "Mehsana", "Navsari", "Bhuj", "Palanpur", "Porbandar", "Gandhidham", "Valsad"],
  "Haryana": ["Chandigarh", "Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Rewari", "Sirsa", "Kaithal", "Jind", "Kurukshetra", "Bahadurgarh"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Manali", "Hamirpur", "Bilaspur", "Palampur", "Nahan", "Chamba", "Kangra"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Rajouri", "Poonch", "Kargil", "Leh", "Budgam"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka", "Phusro", "Chaibasa", "Garhwa", "Pakur", "Sahebganj"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Davanagere", "Bellary", "Gulbarga", "Shimoga", "Tumkur", "Udupi", "Hospet", "Hassan", "Raichur", "Bidar", "Chitradurga", "Robertson Pet", "Gadag-Betageri"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur", "Kottayam", "Malappuram", "Kasargod", "Pathanamthitta", "Idukki", "Wayanad", "Munnar"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Mandsaur", "Damoh", "Hoshangabad", "Itarsi", "Neemuch", "Pithampur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Malegaon", "Nanded", "Sangli", "Jalgaon", "Akola", "Latur", "Ahmednagar", "Dhule", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Bhiwandi", "Vasai-Virar", "Panvel", "Kalyan-Dombivli", "Mira-Bhayandar", "Ulhasnagar", "Satara", "Wardha", "Yavatmal"],
  "Manipur": ["Imphal", "Bishnupur", "Churachandpur", "Thoubal", "Ukhrul", "Senapati", "Tamenglong", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Williamnagar", "Mawlai", "Resubelpara"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Saiha", "Lawngtlai", "Mamit"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Longleng", "Kiphire"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Barbil", "Angul", "Dhenkanal", "Kendujhar", "Paradeep", "Sunabeda", "Talcher"],
  "Puducherry": ["Puducherry", "Karaikal", "Yanam", "Mahe"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Abohar", "Firozpur", "Kapurthala", "Barnala", "Rupnagar", "Sangrur", "Malerkotla", "Fatehgarh Sahib"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Pali", "Tonk", "Sri Ganganagar", "Bharatpur", "Churu", "Jhunjhunu", "Hanumangarh", "Dungarpur", "Banswara", "Baran", "Jhalawar", "Nagaur", "Sawai Madhopur", "Chittorgarh", "Kishangarh", "Beawar"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo", "Singtam", "Jorethang"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Nagercoil", "Kanchipuram", "Kumbakonam", "Cuddalore", "Rajapalayam", "Hosur", "Ooty", "Kodaikanal"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Mancherial", "Wanaparthy", "Bhongir"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Khowai", "Ambassa", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad", "Noida", "Prayagraj", "Meerut", "Bareilly", "Moradabad", "Saharanpur", "Aligarh", "Gorakhpur", "Faizabad", "Jhansi", "Firozabad", "Mathura", "Muzaffarnagar", "Shahjahanpur", "Rampur", "Sambhal", "Amroha", "Etawah", "Hapur", "Loni", "Unnao", "Rae Bareli", "Sitapur", "Hardoi", "Banda", "Mirzapur", "Bulandshahr", "Basti"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Nainital", "Mussoorie", "Almora", "Pithoragarh", "Rudrapur", "Kashipur", "Kotdwar", "Ramnagar", "Tehri", "Pauri", "Champawat"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Krishnanagar", "Nabadwip", "Medinipur", "Balurghat", "Basirhat", "Jalpaiguri", "Cooch Behar", "Darjeeling", "Haldia", "Kharagpur", "Suri", "Raiganj", "Contai", "Ranaghat", "Bangaon", "Diamond Harbour", "Uluberia"]
};

function populateStateDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Select State</option>';
    const states = Object.keys(INDIAN_LOCATIONS).sort();
    states.forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        select.appendChild(opt);
    });
}

function populateCityDropdown(stateSelectId, citySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const citySelect = document.getElementById(citySelectId);
    if (!citySelect) return;
    citySelect.innerHTML = '<option value="">Select City</option>';
    if (!stateSelect || !stateSelect.value) {
        citySelect.disabled = true;
        return;
    }
    citySelect.disabled = false;
    const cities = INDIAN_LOCATIONS[stateSelect.value] || [];
    cities.sort().forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
    });
}

function setupCascadingDropdowns(stateSelectId, citySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    if (stateSelect) {
        stateSelect.addEventListener('change', function() {
            populateCityDropdown(stateSelectId, citySelectId);
        });
    }
    populateStateDropdown(stateSelectId);
    populateCityDropdown(stateSelectId, citySelectId);
}
