Origin 
https://github.com/jaehyoun100/ktds-23-pms-react

프로젝트 종료 후 연습을 위해 fork 하지 않음






# 중요 공지사항
### css 겹침 현상 제거하는 법 (POST CSS 사용법)
1. 기존 css파일의 이름을 @@@.module.css 형태로 변경한다. ex) project.module.css
2. 적용하고 싶은 js파일에 import styles from "../@@@.module.css" 형식으로 import 한다.
3. js 내부의 className 을 className={styles.barContainer} 형태로 만든다!! ----> 이 때 클래스의 이름은 Camelcase 형태로 구성해야한다.
4. css 내부 역시 기존 className을 Camelcase 형태로 구성한다.
5. 잘 적용되는 지 확인한다 ^^
@@@ className을 여러개 주고 싶을 때는 백틱을 사용하여 구성한다. ex ) <div className={`${styles.displayFlex} ${styles.readmeMargin}`}>



