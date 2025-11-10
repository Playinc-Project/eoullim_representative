import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

// 또는 firebase 설정 파일에서 가져오기
import { auth } from '../../firebase';