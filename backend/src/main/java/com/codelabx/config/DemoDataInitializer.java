package com.codelabx.config;

import com.codelabx.practical.*;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DemoDataInitializer {
    @Bean
    CommandLineRunner seedDemoData(UserRepository users, PracticalRepository practicals,
                                   PracticalAssignmentRepository assignments,
                                   PracticeQuestionRepository practiceQuestions,
                                   VivaQuestionRepository vivaQuestions,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            if (practicals.count() > 0) return;

            UserAccount teacher = user(users, passwordEncoder, "Avery Mukadam", "teacher@codelabx.dev", Role.TEACHER);
            UserAccount student = user(users, passwordEncoder, "Riya Sharma", "student@codelabx.dev", Role.STUDENT);
            UserAccount student2 = user(users, passwordEncoder, "Kabir Patel", "student2@codelabx.dev", Role.STUDENT);
            List<PracticalSeed> seeds = List.of(
                    new PracticalSeed("Array Operations", "Traverse and update a one-dimensional array.", "Implement common operations on a fixed-size integer array.", "An array stores elements of the same type in contiguous indexed positions. Access by index is constant time, while insertion or deletion in the middle requires shifting elements.", "1. Read n and n integer values.\n2. Read the target value.\n3. Traverse the array from index 0 to n - 1.\n4. Print each matching index, or report that the value is absent.", "Write a program that reads an integer array and a target value, then prints all matching positions. Use zero-based indices.", "Explain how the number of inspected elements changes as the array grows. Mention one edge case you tested.", List.of("What is the time complexity of accessing an array element by index?", "What should your program do when the array is empty?"), List.of("Why is array access by index constant time?", "What is the cost of inserting at the beginning of an array?")),
                    new PracticalSeed("Searching Algorithms", "Compare linear search with binary search.", "Implement a search and reason about when sorted input is required.", "Linear search checks items one by one and works on unsorted data. Binary search repeatedly halves a sorted search interval, giving logarithmic comparisons.", "1. Set low = 0 and high = n - 1.\n2. While low <= high, compute mid.\n3. Compare the middle value with the target.\n4. Narrow the interval to the half that may contain the target.\n5. Return the index or -1.", "Implement iterative binary search for a sorted integer array. Print the matching index, or -1 if the target is absent.", "State why the input must be sorted for binary search and compare its worst-case complexity with linear search.", List.of("What condition makes binary search valid?", "How many elements remain after each binary-search iteration?"), List.of("What is binary search's worst-case time complexity?", "How would you avoid overflow when calculating mid?")),
                    new PracticalSeed("Sorting Algorithms", "Sort a list using insertion sort.", "Build a sorted sequence by inserting each next value into place.", "Insertion sort grows a sorted prefix. For each new value, larger items in the prefix shift right until the correct position is found. It is simple and effective for small or nearly sorted inputs.", "1. Start from the second element.\n2. Store the current value as key.\n3. Shift larger values one position to the right.\n4. Insert key into the gap.\n5. Repeat to the end of the array.", "Read n integers, sort them in ascending order using insertion sort, and print the resulting sequence.", "Describe what happens on already sorted input and give the algorithm's best- and worst-case time complexity.", List.of("Why do we begin at index 1?", "What is the best-case complexity for already sorted input?"), List.of("Is insertion sort stable? Explain briefly.", "When might insertion sort be preferable to a more complex sort?"))
            );
            for (PracticalSeed seed : seeds) {
                Practical practical = new Practical();
                practical.setCreatedBy(teacher);
                practical.setTitle(seed.title()); practical.setDescription(seed.description());
                practical.setAim(seed.aim()); practical.setTheory(seed.theory()); practical.setAlgorithm(seed.algorithm());
                practical.setCodeInstructions(seed.instructions()); practical.setConclusion(seed.conclusion());
                practical.setJavaStarterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write your solution\n    }\n}");
                practical.setPythonStarterCode("def main():\n    # Write your solution\n    pass\n\nif __name__ == '__main__':\n    main()\n");
                practical.setStatus(PracticalStatus.PUBLISHED);
                practical = practicals.save(practical);
                for (int i = 0; i < seed.practice().size(); i++) {
                    PracticeQuestion q = new PracticeQuestion(); q.setPractical(practical); q.setQuestion(seed.practice().get(i)); q.setExpectedAnswer("Discuss the concept accurately with reasoning."); q.setSortOrder(i + 1); practiceQuestions.save(q);
                }
                for (int i = 0; i < seed.viva().size(); i++) {
                    VivaQuestion q = new VivaQuestion(); q.setPractical(practical); q.setQuestion(seed.viva().get(i)); q.setMarks(2); q.setSortOrder(i + 1); vivaQuestions.save(q);
                }
                for (UserAccount enrolled : List.of(student, student2)) {
                    PracticalAssignment assignment = new PracticalAssignment(); assignment.setPractical(practical); assignment.setStudent(enrolled); assignments.save(assignment);
                }
            }
        };
    }

    private UserAccount user(UserRepository users, PasswordEncoder encoder, String name, String email, Role role) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            UserAccount u = new UserAccount(); u.setName(name); u.setEmail(email); u.setRole(role);
            u.setPassword(encoder.encode("CodeLabX123!")); return users.save(u);
        });
    }

    private record PracticalSeed(String title, String description, String aim, String theory, String algorithm,
                                 String instructions, String conclusion, List<String> practice, List<String> viva) { }
}
