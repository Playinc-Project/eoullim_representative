package com.eoullim_backend;

import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        createTestUsers();
    }
    
    private void createTestUsers() {
        // 테스트 계정이 없으면 생성
        if (!userRepository.existsByEmail("jinyeonge1234@naver.com")) {
            User testUser = User.builder()
                    .email("jinyeonge1234@naver.com")
                    .password("password123") // 실제로는 암호화해야 함
                    .username("테스트유저")
                    .bio("테스트용 사용자 계정입니다.")
                    .build();
            
            userRepository.save(testUser);
            System.out.println("✅ 테스트 계정 생성됨 - Email: jinyeonge1234@naver.com, Password: password123");
        }

        // 관리자 계정도 생성
        if (!userRepository.existsByEmail("admin@eoullim.com")) {
            User adminUser = User.builder()
                    .email("admin@eoullim.com")
                    .password("admin123") // 실제로는 암호화해야 함
                    .username("관리자")
                    .bio("시스템 관리자 계정입니다.")
                    .build();
            
            userRepository.save(adminUser);
            System.out.println("✅ 관리자 계정 생성됨 - Email: admin@eoullim.com, Password: admin123");
        }

        // 추가 샘플 사용자들
        if (!userRepository.existsByEmail("user1@example.com")) {
            User sampleUser1 = User.builder()
                    .email("user1@example.com")
                    .password("user123")
                    .username("일반유저1")
                    .bio("안녕하세요! 일반 사용자입니다.")
                    .build();
            
            userRepository.save(sampleUser1);
            System.out.println("✅ 샘플 사용자1 생성됨 - Email: user1@example.com, Password: user123");
        }

        if (!userRepository.existsByEmail("user2@example.com")) {
            User sampleUser2 = User.builder()
                    .email("user2@example.com")
                    .password("user123")
                    .username("일반유저2")
                    .bio("반갑습니다! 두 번째 사용자예요.")
                    .build();
            
            userRepository.save(sampleUser2);
            System.out.println("✅ 샘플 사용자2 생성됨 - Email: user2@example.com, Password: user123");
        }
        
        System.out.println("🎉 데이터 초기화 완료!");
    }
}