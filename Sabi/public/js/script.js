document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const childName = document.getElementById('childName').value;
        const childAge = document.getElementById('childAge').value;
        const parentEmail = document.getElementById('parentEmail').value;
        const parentPhone = document.getElementById('parentPhone').value;
        const courseCategory = document.getElementById('courseCategory').value;
        
        // Validate form
        if (!childName || !childAge || !parentEmail || !parentPhone || !courseCategory) {
            alert('Please fill in all fields');
            return;
        }
        
        // Process payment with Paystack
        const handler = PaystackPop.setup({
            key: 'pk_live_c4db143d371ee8ff7175b5769e42d23a5948ea20', // Replace with your Paystack public key
            email: parentEmail,
            amount: 200, // 5000 Naira in kobo
            currency: 'NGN',
            ref: 'KIDTECH-' + Math.floor(Math.random() * 1000000000 + 1),
            firstname: childName.split(' ')[0],
            lastname: childName.split(' ')[1] || '',
            metadata: {
                custom_fields: [
                    {
                        display_name: "Child Name",
                        variable_name: "child_name",
                        value: childName
                    },
                    {
                        display_name: "Child Age",
                        variable_name: "child_age",
                        value: childAge
                    },
                    {
                        display_name: "Course",
                        variable_name: "course",
                        value: courseCategory
                    }
                ]
            },
            callback: function(response) {
                // On successful payment
                const registrationData = {
                    childName,
                    childAge,
                    parentEmail,
                    parentPhone,
                    courseCategory,
                    paymentReference: response.reference
                };
                
                // Send data to server to forward to WhatsApp
                fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Registration successful! We will contact you shortly with more details.');
                        registrationForm.reset();
                    } else {
                        alert('Registration successful, but we could not send confirmation. Please contact us.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Payment successful but there was an issue with registration. Please contact us.');
                });
            },
            onClose: function() {
                alert('Payment window closed.');
            }
        });
        
        handler.openIframe();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});