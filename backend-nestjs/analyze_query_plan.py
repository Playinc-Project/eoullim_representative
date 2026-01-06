import sqlite3
import json

# SQLite 데이터베이스 연결
db_path = "eoullim_prod.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 80)
print("📊 SQLite EXPLAIN QUERY PLAN 분석")
print("=" * 80)

# 1. 테이블 정보
print("\n[1] 테이블 행 수 확인")
print("-" * 80)

tables = ['comments', 'posts', 'users', 'messages']
for table in tables:
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"✅ {table.upper()}: {count}개 행")
    except Exception as e:
        print(f"❌ {table}: {e}")

# 2. 인덱스 정보
print("\n[2] 인덱스 구성 확인")
print("-" * 80)

cursor.execute("SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
indexes = cursor.fetchall()
for idx_name, tbl_name in indexes:
    print(f"✅ {idx_name} (테이블: {tbl_name})")

# 3. EXPLAIN QUERY PLAN 분석
print("\n[3] 주요 쿼리의 실행 계획 분석")
print("-" * 80)

queries = [
    ("댓글 조회 (user_id로 필터링)", "SELECT * FROM comments WHERE user_id = 1"),
    ("게시글 조회 (user_id로 필터링)", "SELECT * FROM posts WHERE user_id = 1"),
    ("게시글 조회 (id로 필터링)", "SELECT * FROM posts WHERE id = 1"),
    ("댓글 조회 (post_id로 필터링)", "SELECT * FROM comments WHERE post_id = 1"),
]

for description, query in queries:
    print(f"\n📌 {description}")
    print(f"   쿼리: {query}")
    try:
        cursor.execute(f"EXPLAIN QUERY PLAN {query}")
        plan = cursor.fetchall()
        for row in plan:
            print(f"   → {row}")
    except Exception as e:
        print(f"   ❌ 오류: {e}")

# 4. 인덱스 사용 여부 확인
print("\n[4] 인덱스 사용 여부 검증")
print("-" * 80)

validation_queries = [
    ("idx_comment_user_id 활용", "SELECT * FROM comments WHERE user_id = 1"),
    ("idx_post_user_id 활용", "SELECT * FROM posts WHERE user_id = 1"),
    ("idx_comment_post_id 활용", "SELECT * FROM comments WHERE post_id = 1"),
]

for description, query in validation_queries:
    print(f"\n✓ {description}")
    print(f"  쿼리: {query}")
    try:
        cursor.execute(f"EXPLAIN QUERY PLAN {query}")
        plan = cursor.fetchall()
        plan_text = str(plan)
        
        if "USING INDEX" in plan_text:
            print(f"  ✅ 인덱스 사용: YES (SEARCH TABLE USING INDEX)")
        elif "SCAN" in plan_text:
            print(f"  ⚠️  인덱스 미사용: NO (SCAN TABLE - 전체 행 스캔)")
        else:
            print(f"  실행계획: {plan}")
    except Exception as e:
        print(f"  ❌ 오류: {e}")

# 5. 통계
print("\n[5] 성능 개선 예상 효과")
print("-" * 80)

cursor.execute("SELECT COUNT(*) FROM comments")
comments_count = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM posts")
posts_count = cursor.fetchone()[0]

print(f"\n현재 데이터:  ")
print(f"  • comments 테이블: {comments_count}개 행")
print(f"  • posts 테이블: {posts_count}개 행")

if comments_count > 0:
    print(f"\n인덱스 미사용 시:")
    print(f"  • comments의 user_id 조회: 모든 {comments_count}개 행 스캔 필요")
    print(f"\n인덱스 사용 시:")
    avg_per_user = max(1, comments_count // 10)  # 평균 10명의 사용자 가정
    print(f"  • 평균 {avg_per_user}개 행만 스캔 (약 {100 - (avg_per_user*100//comments_count)}% 스캔 감소)")

print("\n" + "=" * 80)

conn.close()
print("✅ 분석 완료!")
