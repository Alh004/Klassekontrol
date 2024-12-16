const app = Vue.createApp({
    data() {
        return {
            classrooms: [],
            error: null,
            showClassrooms: false,
            searchQuery: "",
            filteredClassrooms: [],
            newClassroom: {
                teacherName: "",
                studentCount: null,
                sessionActive: false
            },
            showAddClassroomForm: false,
            // Weather-related data
            weather: {
                temperature: null,
                description: "",
                humidity: null
            },
            showWeather: false
        };
    },
    methods: {
        async toggleClassrooms() {
            this.error = null;
            if (this.showClassrooms) {
                this.showClassrooms = false;
            } else {
                try {
                    const response = await axios.get('http://localhost:5131/api/Classrooms');
                    this.classrooms = response.data;
                    this.filteredClassrooms = this.classrooms;
                    this.showClassrooms = true;
                } catch (error) {
                    this.error = 'Error fetching classrooms: ' + error.message;
                }
            }
        },
        async deleteClassroom(classID) {
            if (confirm(`Are you sure you want to delete the classroom with ID: ${classID}?`)) {
                try {
                    await axios.delete(`http://localhost:5131/api/Classrooms/${classID}`);
                    this.classrooms = this.classrooms.filter(c => c.classID !== classID);
                    this.filteredClassrooms = this.filteredClassrooms.filter(c => c.classID !== classID);
                } catch (error) {
                    this.error = 'Error deleting classroom: ' + error.message;
                }
            }
        },
        async editClassroom(classID) {
            const classroom = this.classrooms.find(c => c.classID === classID);
  
            if (!classroom) {
                alert("Classroom not found!");
                return;
            }
  
            const newTeacher = prompt("Enter new teacher's name:", classroom.teacherName) || classroom.teacherName;
            const newStudentCount = parseInt(
                prompt("Enter new student count:", classroom.studentCount) || classroom.studentCount
            );
  
            try {
                await axios.put(`http://localhost:5131/api/Classrooms/${classID}`, {
                    classID,
                    teacherName: newTeacher,
                    studentCount: newStudentCount,
                    sessionActive: classroom.sessionActive,
                });
                classroom.teacherName = newTeacher;
                classroom.studentCount = newStudentCount;
            } catch (error) {
                this.error = 'Error updating classroom: ' + error.message;
            }
        },
        filterClassrooms() {
            const query = this.searchQuery.trim().toLowerCase();
            if (query) {
                this.filteredClassrooms = this.classrooms.filter(classroom => 
                    classroom.classID.toString().includes(query)
                );
            } else {
                this.filteredClassrooms = this.classrooms;
            }
        },
        resetSearch() {
            this.searchQuery = "";
            this.filteredClassrooms = this.classrooms;
        },
        async addClassroom() {
            if (!this.newClassroom.teacherName || this.newClassroom.studentCount == null) {
                this.error = "All fields are required.";
                return;
            }
  
            try {
                const response = await axios.post('http://localhost:5131/api/Classrooms', this.newClassroom);
                this.classrooms.push(response.data);
                this.filteredClassrooms.push(response.data);
                this.newClassroom = { teacherName: "", studentCount: null, sessionActive: false };
                this.showAddClassroomForm = false;
            } catch (error) {
                this.error = 'Error adding classroom: ' + error.message;
            }
        },
        toggleAddClassroomForm() {
            this.showAddClassroomForm = !this.showAddClassroomForm;
        },
        // Weather-related methods
        async fetchWeather() {
          this.error = null;
          try {
              const response = await axios.get(
                  'https://api.openweathermap.org/data/2.5/weather?q=Copenhagen&units=metric&appid=494e21ac3cf356b59cb7ee15555454aa'
              );
              console.log('Weather Data:', response.data); // Check if the API response is correct
              this.weather = response.data;
          } catch (error) {
              console.error('Error fetching weather:', error.response ? error.response.data : error.message);
              this.error = 'Error fetching weather: ' + (error.response ? error.response.data.message : error.message);
          }
      },
        toggleWeather() {
            this.showWeather = !this.showWeather;
            if (this.showWeather) {
                this.fetchWeather();
            }
        }
    }
  });
  app.mount('#app');