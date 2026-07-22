package com.lawlink.config;

import com.lawlink.model.LawyerProfile;
import com.lawlink.model.User;
import com.lawlink.repository.LawyerProfileRepository;
import com.lawlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedLawyers();
        }
        seedAdminIfNotExists();
        migrateOldEmails();
        ensureSeededLawyersVerified();
    }

    private void migrateOldEmails() {
        boolean migrated = false;
        String newPasswordHash = passwordEncoder.encode("caseflow123");
        for (User user : userRepository.findAll()) {
            boolean changed = false;
            if (user.getEmail() != null && user.getEmail().contains("@lawlink.com")) {
                user.setEmail(user.getEmail().replace("@lawlink.com", "@caseflow.com"));
                changed = true;
            }
            if (user.getRole() != null && user.getRole().equals("LAWYER")) {
                user.setPassword(newPasswordHash);
                changed = true;
            }
            if (changed) {
                userRepository.save(user);
                migrated = true;
            }
        }
        for (LawyerProfile profile : lawyerProfileRepository.findAll()) {
            if (profile.getEmail() != null && profile.getEmail().contains("@lawlink.com")) {
                profile.setEmail(profile.getEmail().replace("@lawlink.com", "@caseflow.com"));
                lawyerProfileRepository.save(profile);
                migrated = true;
            }
        }
        if (migrated) log.info("Migrated @lawlink.com emails to @caseflow.com and updated passwords");
    }

    private void seedLawyers() {
        log.info("Seeding database with sample lawyer profiles...");

        Object[][] lawyers = {
            {"Arjun Mehta", "arjun@caseflow.com", "Criminal Defense & Litigation", "BAR-DEL-1001", "criminal", 15, "Mehta & Associates, Delhi", "Arjun Mehta is a seasoned criminal lawyer with a robust practice in Delhi courts. With 15 years of experience, he has handled white-collar crimes and a wide range of IPC offenses.", "LL.B., Faculty of Law, University of Delhi", List.of("Trial advocacy and cross-examination", "Bail applications and anticipatory bail", "White-collar crime litigation")},
            {"Priya Sharma", "priya@caseflow.com", "Corporate & Commercial Law", "BAR-MUM-2002", "corporate", 12, "Sharma Legal, Mumbai", "Priya Sharma is a highly accomplished corporate lawyer based in Mumbai with 12+ years advising Indian and multinational companies on M&A, joint ventures, and regulatory compliance.", "LL.B., National Law School of India University, Bangalore", List.of("Drafting and vetting commercial contracts", "SEBI and RBI regulatory compliance", "Corporate restructuring and M&A advisory")},
            {"Sneha Iyer", "sneha@caseflow.com", "Family Law", "BAR-CHN-3003", "family", 10, "Iyer Law Practice, Chennai", "Sneha Iyer is a Chennai-based family law expert with 10 years handling divorce, custody, and domestic violence cases. Known for her empathetic approach.", "LL.B., Tamil Nadu Dr. Ambedkar Law University", List.of("Mediation for family disputes", "Hindu Marriage Act & PWDV Act filings", "Wills and property settlements")},
            {"Rajesh Gupta", "rajesh@caseflow.com", "Intellectual Property Rights", "BAR-BLR-4004", "property", 8, "Gupta IP Solutions, Bengaluru", "Rajesh Gupta is Bengaluru leading IP lawyer, with 8 years protecting trademarks, copyrights, and patents for startups and established businesses.", "LL.B., NUALS, Kochi", List.of("Trademark and patent registration", "IP enforcement and litigation", "Drafting IP licensing agreements")},
            {"Rohit Khanna", "rohit@caseflow.com", "Constitutional Law", "BAR-DEL-5005", "civil", 18, "Khanna Chambers, New Delhi", "Adv. Rohit Khanna is a distinguished New Delhi lawyer with 18 years in high-profile constitutional cases. Known for PILs before the Supreme Court.", "LL.B., National Law University, Delhi", List.of("Drafting and filing PILs", "Litigation under Articles 32 & 226", "Administrative law and policy analysis")},
            {"Anjali Menon", "anjali@caseflow.com", "Environmental Law", "BAR-KCH-6006", "other", 10, "Menon Environmental Law, Kochi", "Anjali Menon is a Kochi-based environmental lawyer known for PILs concerning pollution, wildlife protection, and illegal construction.", "LL.B., Symbiosis Law School, Pune", List.of("Filing PILs and EIA assessments", "Indian environmental law compliance", "Wildlife Protection Act litigation")}
        };

        String[] images = {
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733577417/concerned-mature-indian-businessman-at-office-desk-with-laptop-computer_fyr0jm.jpg",
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733577302/business-woman-portrait-and-lawyer-at-a-law-firm-feeling-proud-of-corporate-vision-happiness_meiasa.jpg",
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733577211/portrait-of-female-asian-lawyer-manager-in-formal-suit-working-with-signed-insurance-contract_di8ybi.jpg",
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733576792/portrait-lawyer-and-arms-crossed-with-smile-man-in-office-for-legal-advice-at-law-firm_zngxsy.jpg",
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733576752/portrait-of-attractive-elegant-confident-arabian-or-indian-successful-businessman_et829m.jpg",
            "https://res.cloudinary.com/dzeal21vu/image/upload/v1733753478/portrait-lawyer-and-black-woman-with-tablet-smile-and-happy-in-office-workplace-african_ocig5c.jpg"
        };

        String[] locations = {"Delhi", "Mumbai", "Chennai", "Bengaluru", "New Delhi", "Kochi"};
        String[] cities = {"Delhi", "Mumbai", "Chennai", "Bengaluru", "Delhi", "Kochi"};
        String[] states = {"Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Delhi", "Kerala"};

        for (int i = 0; i < lawyers.length; i++) {
            Object[] l = lawyers[i];

            User user = new User();
            user.setName((String) l[0]);
            user.setEmail((String) l[1]);
            user.setPassword(passwordEncoder.encode("caseflow123"));
            user.setRole("LAWYER");
            user.setPhone("+91 98765 " + (10000 + i));
            user.setLocation(locations[i]);
            user.setProfileImage(images[i]);
            userRepository.save(user);

            LawyerProfile profile = new LawyerProfile();
            profile.setUserId(user.getId());
            profile.setName(user.getName());
            profile.setEmail(user.getEmail());
            profile.setPhone(user.getPhone());
            profile.setBarNumber((String) l[3]);
            profile.setSpecialization((String) l[4]);
            profile.setExperience((int) l[5]);
            profile.setFirm((String) l[6]);
            profile.setCity(cities[i]);
            profile.setState(states[i]);
            profile.setBio((String) l[7]);
            profile.setEducation((String) l[8]);
            profile.setSkills((List<String>) l[9]);
            profile.setProfileImage(images[i]);
            profile.setRating(4.5 + (Math.random() * 0.5));
            profile.setCasesHandled(50 + (int)(Math.random() * 200));
            lawyerProfileRepository.save(profile);
        }

        log.info("Seeded 6 lawyer profiles successfully.");
    }

    private void seedAdminIfNotExists() {
        if (userRepository.findByEmail("admin@caseflow.com").isPresent()) return;
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@caseflow.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setPhone("+91 00000 00000");
        admin.setLocation("Admin");
        userRepository.save(admin);
        log.info("Seeded admin user (admin@caseflow.com / admin123)");
    }

    private void ensureSeededLawyersVerified() {
        for (LawyerProfile profile : lawyerProfileRepository.findAll()) {
            if (!profile.isVerified()) {
                profile.setVerified(true);
                profile.setVerificationStatus("VERIFIED");
                lawyerProfileRepository.save(profile);
            }
        }
        log.info("Ensured all seeded lawyers are verified.");
    }
}
