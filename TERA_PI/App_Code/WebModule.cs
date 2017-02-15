//**********************************************************************************************//
//****                                                                                      ****//
//****                                                                                      ****//
//**** 1. Programmed by : Goodware                                                          ****//
//**** 2. Date : 2013년 7월 26일                                                            ****//
//**** 3. Description                                                                       ****//
//****      1) connection 문자열 만들어준다.                                                ****//
//****      2) connection 개체를 만들어준다.                                                ****//
//****                                                                                      ****//
//**** 4. Related Tables :                                                                  ****//
//**** 5. Modification History                                                              ****//
//****       Who              When          What                                            ****//
//****===================================================================================== ****//
//**** Jung-Hoon Lee	    2013년 7월 26일	소스초기작성                                    ****//
//****                                                                                      ****//
//**********************************************************************************************//
using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.IO; //Fileupload를 위해서 체크를 위해서 
//암호화 함수때문에 추가 
using System.Text.RegularExpressions; //암호화를 위해서 
using System.Linq;



/// <summary>
/// BasePage의 요약 설명입니다.
/// </summary>
public class WebModule : System.Web.UI.Page
{
   
    public SqlConnection Dbcon;
    public static string strKeyValue;

	public WebModule()
	{
		//
		// TODO: 생성자 논리를 여기에 추가합니다.
		//
        Dbcon = new SqlConnection(DbConnectionString);  //DBconnection  생성
        strKeyValue = EncString;
    }


    #region GoodWareKey_ConStr
    protected string EncString
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["GoodWareKey"].ConnectionString;  //문자열 
        }
    }
    #endregion


    #region DB_ConStr
    protected string DbConnectionString
    {
        get
        {
            return ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString;  //문자열 
        }
    }
    #endregion

    

    public DataSet sel_retrunDataset(string strSel)
    {
        //parameter : select sql 문
        //Dataset를 반환하는 function임.

        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = strSel;

        SqlDataAdapter adapt = new SqlDataAdapter(cmd.CommandText, Dbcon);
        DataSet ds = new DataSet();
        
        adapt.Fill(ds);

        return ds;

    }
    
    #region file 중복체크 
    //2006. 06. 16일 

    public string GetUniqueFileName(string dirPath,   string fileN)
    {
        string fileName = fileN;

        int indexOfDot = fileName.LastIndexOf(".");
        string strName = fileName.Substring(0, indexOfDot);
        string strExt = fileName.Substring(indexOfDot + 1);

        bool bExist = true;   //같은 이름의 파일의 존재여부, 있다고 우선 가정
        int fileCount = 0;

        while (bExist)
        {
            if (File.Exists(Path.Combine(dirPath, fileName)))
            {
                fileCount++;
                fileName = strName + "(" + fileCount + ")." + strExt;                
            }
            else
            {
                bExist = false;
            }
        }
        return fileName;
    }

    #endregion

    #region filesize 체크
    public string FormatSize(double fileSize)
    {
        if (fileSize < 1024)
            return String.Format("{0} B", fileSize);
        else if (fileSize < 1024*1024 )
            return String.Format("{0:N2} KB", fileSize/1024);
        else
            return String.Format("{0:N2} MB", fileSize / (1024 * 1024));
    }
    #endregion

    #region fileExtent체크
    public string returnExt(string fileName)
    {
        
        int i;        
        string tempFileNM = fileName.ToLower();
        i = tempFileNM.LastIndexOf(".");  //인덱스 위치를 반환
        string strExt = tempFileNM.Substring(i + 1);
        return strExt;
    }
    #endregion

    #region ExtentOfImage 체크
    public string returnImagePath(string fileExt)
    {
        string imagePath;
        imagePath = "~/images/file/";
        string Images;
        switch (fileExt)
        {
            case "aiff": 

					Images = "aiff.gif";
                    break;

            case "asf": 

					Images = "asf.gif";
                    break;

            case "asp": 

					Images = "asp.gif";
                    break;

            case "asx": 

					Images = "asx.gif";
                    break;

            case "avi": 

					Images = "avi.gif";
                    break;

            case "bat":

					Images = "bat.gif";
                    break;

            case "bmp": 

					Images = "bmp.gif";
                    break;

            case "com": 

					Images = "com.gif";
                    break;

            case "dll": 

					Images = "dll.gif";
                    break;

            case "doc": 

					Images = "doc.gif";
                    break;

            case "exe": 

					Images = "exe.gif";
                    break;

            case "fon": 

					Images = "fon.gif";
                    break;
            case "gif": 

					Images = "gif.gif";
                    break;
            case "gul": 

					Images = "gul.gif";
                    break;
            case "hlp":

                
                Images = "hlp.gif";
                break;
            case "htm": 

					Images = "htm.gif";
                    break;

            case "html": 

					Images = "html.gif";
                    break;

            case "hwp" :

					Images = "hwp.gif";
                    break;

            case "image" :

					Images = "image.gif";
                    break;

            case "inf" :

					Images = "inf.gif";
                    break;


            case "ini" :

					Images = "ini.gif";
                    break;


            case "jpg" :

					Images = "jpg.gif";
                    break;

            case "mdb" :

					Images = "mdb.gif";
                    break;

            case "mdw" :

					Images = "mdw.gif";
                    break;
            case "mid" :

					Images = "mid.gif";
                    break;
            case "mov" :

					Images = "mov.gif";
                    break;
            case "mp3" :

					Images = "mp3.gif";
                    break;
            case "mpg" :

					Images = "mpg.gif";
                    break;
            case "pcx" :

					Images = "pcx.gif";
                    break;
            case "pdf" :

					Images = "pdf.gif";
                    break;
            case "pic" :

					Images = "pic.gif";
                    break;
            case "png" :

					Images = "png.gif";
                    break;
            case "ppt" :

					Images = "ppt.gif";
                    break;
            case "psd": 

					Images = "psd.gif";
                    break;
            case "ra" :

					Images = "ra.gif";
                    break;
            case "reg": 

					Images = "reg.gif";
                    break;
            case "rtf": 

					Images = "rtf.gif";
                    break;
            case "tga": 

					Images = "tga.gif";
                    break;
            case "tif": 

					Images = "tif.gif";
                    break;
            case "ttf": 

					Images = "ttf.gif";
                    break;
            case "txt": 

					Images = "txt.gif";
                    break;
            case "vdo": 

					Images = "vdo.gif";
                    break;
            case "wav": 

					Images = "wav.gif";
                    break;
            case "wmf": 

					Images = "wmf.gif";
                    break;
            case "wri": 

					Images = "wri.gif";
                    break;
            case "xls": 

					Images = "xls.gif";
                    break;
            case "xml": 

					Images = "xml.gif";
                    break;
            case "zip": 

					Images = "zip.gif";
                    break;
            default:
                    Images = "unknown.gif";
                    break;

        }
        imagePath = imagePath + Images;
        return imagePath;
    }
    #endregion

    public string ReplaceBR(string s)
    {
        //문자열치환
        return s.Replace("\n", "<BR>");
    }
    public int ExecuteSql(string str_sql)
    {
        int effectRow = 0;  //반영여부를 체크하는 변수
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = Dbcon;
        cmd.CommandText = str_sql;

        try
        {
            Dbcon.Open();
            effectRow = cmd.ExecuteNonQuery();
        }
        catch(Exception ex)
        {
            //로그쓰는 부분이 필요함.
        }

        finally
        {
            Dbcon.Close();
        }
        return effectRow;
    }

    // 암호화 모듈에 필요한 함수 정의

    #region Encrypt
    /// <summary>
    /// AES 적용 Text Encrypt
    /// 작성자 : 류재상
    /// 작성일 : 2011년 02월 09일
    /// </summary>
    /// <param name="plaintext"></param>
    /// <param name="password"></param>
    /// <param name="nBits"></param>
    /// <returns></returns>
    public string Encrypt(string plaintext, string password, int nBits)
    {


        UInt64 blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return "";  // standard allows 128/192/256 bit keys
        plaintext = UTF8.Encode(plaintext);
        password = UTF8.Encode(password);  //Utf8.encode(password);


        // use AES itself to encrypt password to get cipher key (using plain password as source for key 
        // expansion) - gives us well encrypted key
        var nBytes = nBits / 8;  // no bytes in key

        UInt64[] pwBytes = new UInt64[nBytes];

        for (var i = 0; i < nBytes; i++)
        {
            pwBytes[i] = double.IsNaN((int)password[i]) ? 0 : (UInt64)password[i];
        }

        UInt64[] key = cipher(pwBytes, keyExpansion(pwBytes));  // gives us 16-byte key


        key = key.Concat(Slice(key, 0, nBytes - 16)).ToArray<UInt64>();     // expand key to 16/24/32 bytes long


        // initialise counter block (NIST SP800-38A §B.2): millisecond time-stamp for nonce in 1st 8 bytes,
        // block counter in 2nd 8 bytes

        UInt64[] counterBlock = new UInt64[blockSize];
        Int64 nonce = GetUTCTime(); // timestamp: milliseconds since 1-Jan-1970
        //nonce = 1297232564974;  // <== JavaScript 버전과 테스트 할때 사용

        UInt64 nonceSec = (UInt64)Math.Floor((double)(nonce / 1000));
        UInt64 nonceMs = (UInt64)(nonce % 1000);

        // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part filling 2nd 4 bytes
        for (var i = 0; i < 4; i++) counterBlock[i] = (nonceSec >> i * 8) & 0xff;
        for (var i = 0; i < 4; i++) counterBlock[i + 4] = nonceMs & 0xff;
        // and convert it to a string to go on the front of the ciphertext
        var ctrTxt = "";
        for (var i = 0; i < 8; i++) ctrTxt += ((char)counterBlock[i]).ToString();//String.fromCharCode(counterBlock[i]);

        // generate key schedule - an expansion of the key into distinct Key Rounds for each round
        var keySchedule = keyExpansion(key);


        UInt64 blockCount = (UInt64)Math.Ceiling((decimal)plaintext.Length / (decimal)blockSize);
        string[] ciphertxt = new string[blockCount]; // ciphertext as array of strings

        for (UInt64 b = 0; b < blockCount; b++)
        {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
            for (int c = 0; c < 4; c++) counterBlock[15 - c] = (b >> c * 8) & 0xff;
            for (int c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b / (UInt64)0x100000000 >> c * 8);

            UInt64[] cipherCntr = cipher(counterBlock, keySchedule);  // -- encrypt counter block --

            // block size is reduced on final block
            UInt64 blockLength = b < blockCount - 1 ? blockSize : ((UInt64)plaintext.Length - 1) % blockSize + 1;
            String[] cipherChar = new String[blockLength];

            for (int i = 0; i < (int)blockLength; i++)
            {  // -- xor plaintext with ciphered counter char-by-char --
                cipherChar[i] = ((char)((int)cipherCntr[i] ^ (int)plaintext[(int)b * (int)blockSize + i])).ToString();// plaintext.charCodeAt(b * blockSize + i);
                //cipherChar[i] = cipherChar[i].ToString();
            }
            ciphertxt[b] = string.Join("", cipherChar); //cipherChar.Join("",cipherChar);
        }

        // Array.join is more efficient than repeated string concatenation in IE
        string ciphertext = ctrTxt + string.Join("", ciphertxt);

        // Base64 Encode
        ciphertext = Base64.Endode(ciphertext);

        return ciphertext;
    }
    #endregion

    #region Encrypt
    /// <summary>
    /// AES 적용 Text Encrypt
    /// 작성자 : 류재상
    /// 작성일 : 2011년 02월 09일
    /// </summary>
    /// <param name="plaintext"></param>
    /// <param name="password"></param>
    /// <param name="nBits"></param>
    /// <returns></returns>
    public string Encrypt(string plaintext, int nBits)
    {


        UInt64 blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return "";  // standard allows 128/192/256 bit keys
        plaintext = UTF8.Encode(plaintext);
        string password = UTF8.Encode(strKeyValue);  //Utf8.encode(password);


        // use AES itself to encrypt password to get cipher key (using plain password as source for key 
        // expansion) - gives us well encrypted key
        var nBytes = nBits / 8;  // no bytes in key

        UInt64[] pwBytes = new UInt64[nBytes];

        for (var i = 0; i < nBytes; i++)
        {
            pwBytes[i] = double.IsNaN((int)password[i]) ? 0 : (UInt64)password[i];
        }

        UInt64[] key = cipher(pwBytes, keyExpansion(pwBytes));  // gives us 16-byte key


        key = key.Concat(Slice(key, 0, nBytes - 16)).ToArray<UInt64>();     // expand key to 16/24/32 bytes long


        // initialise counter block (NIST SP800-38A §B.2): millisecond time-stamp for nonce in 1st 8 bytes,
        // block counter in 2nd 8 bytes

        UInt64[] counterBlock = new UInt64[blockSize];
        Int64 nonce = GetUTCTime(); // timestamp: milliseconds since 1-Jan-1970
        //nonce = 1297232564974;  // <== JavaScript 버전과 테스트 할때 사용

        UInt64 nonceSec = (UInt64)Math.Floor((double)(nonce / 1000));
        UInt64 nonceMs = (UInt64)(nonce % 1000);

        // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part filling 2nd 4 bytes
        for (var i = 0; i < 4; i++) counterBlock[i] = (nonceSec >> i * 8) & 0xff;
        for (var i = 0; i < 4; i++) counterBlock[i + 4] = nonceMs & 0xff;
        // and convert it to a string to go on the front of the ciphertext
        var ctrTxt = "";
        for (var i = 0; i < 8; i++) ctrTxt += ((char)counterBlock[i]).ToString();//String.fromCharCode(counterBlock[i]);

        // generate key schedule - an expansion of the key into distinct Key Rounds for each round
        var keySchedule = keyExpansion(key);


        UInt64 blockCount = (UInt64)Math.Ceiling((decimal)plaintext.Length / (decimal)blockSize);
        string[] ciphertxt = new string[blockCount]; // ciphertext as array of strings

        for (UInt64 b = 0; b < blockCount; b++)
        {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
            for (int c = 0; c < 4; c++) counterBlock[15 - c] = (b >> c * 8) & 0xff;
            for (int c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b / (UInt64)0x100000000 >> c * 8);

            UInt64[] cipherCntr = cipher(counterBlock, keySchedule);  // -- encrypt counter block --

            // block size is reduced on final block
            UInt64 blockLength = b < blockCount - 1 ? blockSize : ((UInt64)plaintext.Length - 1) % blockSize + 1;
            String[] cipherChar = new String[blockLength];

            for (int i = 0; i < (int)blockLength; i++)
            {  // -- xor plaintext with ciphered counter char-by-char --
                cipherChar[i] = ((char)((int)cipherCntr[i] ^ (int)plaintext[(int)b * (int)blockSize + i])).ToString();// plaintext.charCodeAt(b * blockSize + i);
                //cipherChar[i] = cipherChar[i].ToString();
            }
            ciphertxt[b] = string.Join("", cipherChar); //cipherChar.Join("",cipherChar);
        }

        // Array.join is more efficient than repeated string concatenation in IE
        string ciphertext = ctrTxt + string.Join("", ciphertxt);

        // Base64 Encode
        ciphertext = Base64.Endode(ciphertext);

        return ciphertext;
    }
    #endregion

    #region Decrypt
    /// <summary>
    /// AES 적용 Text Decrypt
    /// 작성자 : 류재상
    /// 작성일 : 2011년 02월 09일
    /// </summary>
    /// <param name="ciphertext"></param>
    /// <param name="password"></param>
    /// <param name="nBits"></param>
    /// <returns></returns>
    public string Decrypt(string ciphertext, string password, int nBits)
    {

        int blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return "";  // standard allows 128/192/256 bit keys
        ciphertext = Base64.Decode(ciphertext);
        password = UTF8.Encode(password);


        // use AES to encrypt password (mirroring encrypt routine)
        var nBytes = nBits / 8;  // no bytes in key
        UInt64[] pwBytes = new UInt64[nBytes];

        for (var i = 0; i < nBytes; i++)
        {
            pwBytes[i] = double.IsNaN((int)password[i]) ? 0 : (UInt64)password[i];
        }

        UInt64[] key = cipher(pwBytes, keyExpansion(pwBytes));
        key = key.Concat(Slice(key, 0, nBytes - 16)).ToArray<UInt64>();  // expand key to 16/24/32 bytes long

        // recover nonce from 1st 8 bytes of ciphertext
        UInt64[] counterBlock = new UInt64[blockSize];
        string ctrTxt = ciphertext.Substring(0, 8);
        for (var i = 0; i < 8; i++) counterBlock[i] = (UInt64)ctrTxt[i];

        // generate key schedule
        var keySchedule = keyExpansion(key);

        // separate ciphertext into blocks (skipping past initial 8 bytes)
        int nBlocks = (int)Math.Ceiling((decimal)(ciphertext.Length - 8) / (decimal)blockSize);


        string[] ct = new string[nBlocks];
        for (var b = 0; b < nBlocks; b++) ct[b] = Slice(ciphertext, 8 + b * blockSize, 8 + b * blockSize + blockSize <= ciphertext.Length ? 8 + b * blockSize + blockSize : ciphertext.Length);

        // plaintext will get generated block-by-block into array of block-length strings
        string[] plaintxt = new string[ct.Length];

        for (var b = 0; b < nBlocks; b++)
        {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            for (var c = 0; c < 4; c++) counterBlock[15 - c] = (UInt64)((b) >> c * 8) & 0xff;
            for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (UInt64)(((int)((b + 1) / (decimal)(((UInt64)0x100000000)) - 1)) >> c * 8) & 0xff;

            var cipherCntr = cipher(counterBlock, keySchedule);  // encrypt counter block

            UInt64[] plaintxtByte = new UInt64[ct[b].Length];
            string[] plaintxtString = new string[ct[b].Length];
            for (var i = 0; i < ct[b].Length; i++)
            {
                // -- xor plaintxt with ciphered counter byte-by-byte --
                plaintxtByte[i] = cipherCntr[i] ^ (UInt64)ct[b][i];
                plaintxtString[i] = ((char)plaintxtByte[i]).ToString();
            }
            plaintxt[b] = string.Join("", plaintxtString);
        }

        // join array of blocks into single plaintext string
        var plaintext = string.Join("", plaintxt);
        plaintext = UTF8.Decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

        return plaintext;
    }
    #endregion

    #region Decrypt
    /// <summary>
    /// AES 적용 Text Decrypt
    /// 작성자 : 류재상
    /// 작성일 : 2011년 02월 09일
    /// </summary>
    /// <param name="ciphertext"></param>
    /// <param name="password"></param>
    /// <param name="nBits"></param>
    /// <returns></returns>
    public string Decrypt(string ciphertext, int nBits)
    {

        int blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return "";  // standard allows 128/192/256 bit keys
        ciphertext = Base64.Decode(ciphertext);
        string password = UTF8.Encode(strKeyValue);


        // use AES to encrypt password (mirroring encrypt routine)
        var nBytes = nBits / 8;  // no bytes in key
        UInt64[] pwBytes = new UInt64[nBytes];

        for (var i = 0; i < nBytes; i++)
        {
            pwBytes[i] = double.IsNaN((int)password[i]) ? 0 : (UInt64)password[i];
        }

        UInt64[] key = cipher(pwBytes, keyExpansion(pwBytes));
        key = key.Concat(Slice(key, 0, nBytes - 16)).ToArray<UInt64>();  // expand key to 16/24/32 bytes long

        // recover nonce from 1st 8 bytes of ciphertext
        UInt64[] counterBlock = new UInt64[blockSize];
        string ctrTxt = ciphertext.Substring(0, 8);
        for (var i = 0; i < 8; i++) counterBlock[i] = (UInt64)ctrTxt[i];

        // generate key schedule
        var keySchedule = keyExpansion(key);

        // separate ciphertext into blocks (skipping past initial 8 bytes)
        int nBlocks = (int)Math.Ceiling((decimal)(ciphertext.Length - 8) / (decimal)blockSize);


        string[] ct = new string[nBlocks];
        for (var b = 0; b < nBlocks; b++) ct[b] = Slice(ciphertext, 8 + b * blockSize, 8 + b * blockSize + blockSize <= ciphertext.Length ? 8 + b * blockSize + blockSize : ciphertext.Length);

        // plaintext will get generated block-by-block into array of block-length strings
        string[] plaintxt = new string[ct.Length];

        for (var b = 0; b < nBlocks; b++)
        {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            for (var c = 0; c < 4; c++) counterBlock[15 - c] = (UInt64)((b) >> c * 8) & 0xff;
            for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (UInt64)(((int)((b + 1) / (decimal)(((UInt64)0x100000000)) - 1)) >> c * 8) & 0xff;

            var cipherCntr = cipher(counterBlock, keySchedule);  // encrypt counter block

            UInt64[] plaintxtByte = new UInt64[ct[b].Length];
            string[] plaintxtString = new string[ct[b].Length];
            for (var i = 0; i < ct[b].Length; i++)
            {
                // -- xor plaintxt with ciphered counter byte-by-byte --
                plaintxtByte[i] = cipherCntr[i] ^ (UInt64)ct[b][i];
                plaintxtString[i] = ((char)plaintxtByte[i]).ToString();
            }
            plaintxt[b] = string.Join("", plaintxtString);
        }

        // join array of blocks into single plaintext string
        var plaintext = string.Join("", plaintxt);
        plaintext = UTF8.Decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

        return plaintext;
    }
    #endregion

    #region AES 알고리즘 처리용 함수 모음
    private UInt64[][] RCon = {                                    
                                    new UInt64[] {0x00, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x01, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x02, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x04, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x08, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x10, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x20, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x40, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x80, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x1b, 0x00, 0x00, 0x00},
                                    new UInt64[] {0x36, 0x00, 0x00, 0x00}
                                };


    private byte[] SBox = {
                                   0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
                                   0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
                                   0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
                                   0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
                                   0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
                                   0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
                                   0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
                                   0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
                                   0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
                                   0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
                                   0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
                                   0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
                                   0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
                                   0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
                                   0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
                                   0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
                           };

    public UInt64[] cipher(UInt64[] input, UInt64[][] w)
    {

        int Nb = 4;
        int Nr = w.Length / Nb - 1;

        UInt64[][] state = new UInt64[4][];

        for (int i = 0; i < 4 * Nb; i++) state[i % 4] = new UInt64[4];


        for (int i = 0; i < 4 * Nb; i++)
        {
            state[i % 4][(int)(Math.Floor(decimal.Parse((i / 4).ToString())))] = input[i];
        }

        state = addRoundKey(state, w, 0, Nb);

        for (int round = 1; round < Nr; round++)
        {
            state = subBytes(state, Nb);
            state = shiftRows(state, Nb);
            state = mixColumns(state, Nb);
            state = addRoundKey(state, w, round, Nb);
        }


        state = subBytes(state, Nb);
        state = shiftRows(state, Nb);
        state = addRoundKey(state, w, Nr, Nb);


        UInt64[] output = new UInt64[4 * Nb];
        for (int i = 0; i < 4 * Nb; i++)
        {
            output[i] = state[i % 4][(int)(Math.Floor(decimal.Parse((i / 4).ToString())))];
        }

        return output;

    }

    public UInt64[][] keyExpansion(UInt64[] key)
    {

        int Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
        int Nk = key.Length / 4;  // key length (in words): 4/6/8 for 128/192/256-bit keys
        int Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys


        UInt64[][] w = new UInt64[Nb * (Nr + 1)][];
        UInt64[] temp = new UInt64[4];

        for (var i = 0; i < Nk; i++)
        {

            UInt64[] r = new UInt64[4] { key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3] };
            w[i] = r;
        }

        for (var i = Nk; i < (Nb * (Nr + 1)); i++)
        {
            //w[i] = new Array(4);
            w[i] = new UInt64[4];
            for (var t = 0; t < 4; t++) temp[t] = w[i - 1][t];
            if (i % Nk == 0)
            {
                temp = subWord(rotWord(temp));
                for (var t = 0; t < 4; t++) temp[t] ^= RCon[i / Nk][t];
            }
            else if (Nk > 6 && i % Nk == 4)
            {
                temp = subWord(temp);
            }
            for (var t = 0; t < 4; t++) w[i][t] = w[i - Nk][t] ^ temp[t];
        }

        return w;

    }


    /// <summary>
    /// Apply SBOx
    /// </summary>
    /// <param name="state"></param>
    /// <param name="Nb"></param>
    /// <returns></returns>
    private UInt64[][] subBytes(UInt64[][] state, int Nb)
    {
        for (var r = 0; r < 4; r++)
        {
            for (var c = 0; c < Nb; c++) state[r][c] = SBox[state[r][c]];
        }
        return state;
    }


    /// <summary>
    /// Shift Row r of State S Left By r Bytes
    /// </summary>
    /// <param name="state"></param>
    /// <param name="Nb"></param>
    /// <returns></returns>
    private UInt64[][] shiftRows(UInt64[][] state, int Nb)
    {

        UInt64[] t = new UInt64[4];
        for (var r = 1; r < 4; r++)
        {
            for (var c = 0; c < 4; c++) t[c] = state[r][(c + r) % Nb];  // shift into temp copy
            for (var c = 0; c < 4; c++) state[r][c] = t[c];         // and copy back
        }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
        return state;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
    }

    /// <summary>
    /// combine bytes of each col of state
    /// </summary>
    /// <param name="state"></param>
    /// <param name="Nb"></param>
    /// <returns></returns>
    private UInt64[][] mixColumns(UInt64[][] state, int Nb)
    {
        for (var c = 0; c < 4; c++)
        {

            UInt64[] a = new UInt64[4];  // 'a' is a copy of the current column from 's'
            UInt64[] b = new UInt64[4];  // 'b' is a?{02} in GF(2^8)

            for (var i = 0; i < 4; i++)
            {
                a[i] = state[i][c];
                b[i] = (state[i][c] & 0x80) != 0 ? state[i][c] << 1 ^ 0x011b : state[i][c] << 1;

            }
            // a[n] ^ b[n] is a?{03} in GF(2^8)
            state[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
            state[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
            state[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
            state[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
        }
        return state;
    }


    private UInt64[] subWord(UInt64[] w)
    {
        for (var i = 0; i < 4; i++) w[i] = SBox[w[i]];
        return w;
    }

    private UInt64[] rotWord(UInt64[] w)
    {
        var tmp = w[0];
        for (var i = 0; i < 3; i++) w[i] = w[i + 1];
        w[3] = tmp;
        return w;

    }


    /// <summary>
    /// XOR round Key Into State
    /// </summary>
    /// <param name="state"></param>
    /// <param name="w"></param>
    /// <param name="rnd"></param>
    /// <param name="Nb"></param>
    /// <returns></returns>
    private UInt64[][] addRoundKey(UInt64[][] state, UInt64[][] w, int rnd, int Nb)
    {
        for (var r = 0; r < 4; r++)
        {
            for (var c = 0; c < Nb; c++) state[r][c] ^= w[rnd * 4 + c][r];
        }
        return state;
    }

    #endregion

    #region 기타 변환함수
    /// <summary>
    /// 1970-01-01 기준 UTC 시간 가져오기
    /// </summary>
    /// <returns></returns>
    private Int64 GetUTCTime()
    {
        Int64 retval = 0;
        DateTime st = new DateTime(1970, 1, 1);

        TimeSpan t = (DateTime.Now.ToUniversalTime() - st);

        retval = (Int64)(t.TotalMilliseconds + 0.5);
        return retval;

    }

    /// <summary>
    /// Get the array slice between the two indexes.
    /// ... Inclusive for start index, exclusive for end index.
    /// </summary>
    public T[] Slice<T>(T[] source, int start, int end)
    {
        // Handles negative ends.
        if (end < 0)
        {
            end = source.Length + end;
        }
        int len = end - start;

        // Return new array.
        T[] res = new T[len];
        for (int i = 0; i < len; i++)
        {
            res[i] = source[i + start];
        }
        return res;
    }

    public string Slice(string source, int start, int end)
    {
        if (end < 0) // Keep this for negative end support
        {
            end = source.Length + end;
        }
        int len = end - start;               // Calculate length
        return source.Substring(start, len); // Return Substring of length
    }
    #endregion

    #region UTF8 변환
    public static class UTF8
    {

        #region Encode
        public static string Encode(string strUni)
        {

            strUni = Regex.Replace(strUni, @"[\u0080-\u07ff]", new MatchEvaluator(Convert2Byte));
            strUni = Regex.Replace(strUni, @"[\u0800-\uffff]", new MatchEvaluator(Convert3Byte));

            string strUtf = strUni;
            return strUtf;
        }


        private static string Convert2Byte(Match m)
        {
            var cc = (int)m.ToString()[0];
            return new string(new char[] { (char)(0xc0 | cc >> 6), (char)(0x80 | cc & 0x3f) });
        }

        private static string Convert3Byte(Match m)
        {
            var cc = (int)m.ToString()[0];
            return new string(new char[] { (char)(0xe0 | cc >> 12), (char)(0x80 | cc >> 6 & 0x3F), (char)(0x80 | cc & 0x3f) });

        }
        #endregion


        #region Decode


        public static string Decode(string strUtf)
        {
            strUtf = Regex.Replace(strUtf, @"[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]", new MatchEvaluator(Convert3ByteToChar));
            strUtf = Regex.Replace(strUtf, @"[\u00c0-\u00df][\u0080-\u00bf]", new MatchEvaluator(Convert2ByteToChar));
            string strUni = strUtf;
            return strUni;
        }


        private static string Convert3ByteToChar(Match m)
        {
            var cc = (((int)m.ToString()[0] & 0x0f) << 12) | (((int)m.ToString()[1] & 0x3f) << 6) | ((int)m.ToString()[2] & 0x3f);
            return ((char)cc).ToString();
        }

        private static string Convert2ByteToChar(Match m)
        {
            var cc = ((int)m.ToString()[0] & 0x1f) << 6 | (int)m.ToString()[1] & 0x3f;
            return ((char)cc).ToString();
        }


        #endregion
    }
    #endregion


    #region Base64 변환
    public static class Base64
    {
        static string code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


        #region Encode

        public static string Endode(string str)
        {
            return Encode(str, false);
        }

        public static string Encode(string str, bool utf8encode)
        {
            int o1, o2, o3, bits, h1, h2, h3, h4;
            string[] e;
            string pad = "";
            int c;
            string plain;
            string coded;

            string b64 = code;

            plain = utf8encode ? UTF8.Encode(str) : str;

            c = plain.Length % 3;  // pad string to length of multiple of 3
            if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
            // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

            // e 초기화
            e = new string[plain.Length / 3];
            for (c = 0; c < plain.Length; c += 3)
            {  // pack three octets into four hexets

                o1 = (int)plain[c];
                o2 = (int)plain[c + 1];
                o3 = (int)plain[c + 2];

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hextets to index into code string
                e[c / 3] = b64.Substring(h1, 1) + b64.Substring(h2, 1) + b64.Substring(h3, 1) + b64.Substring(h4, 1);
            }
            coded = string.Join("", e);  // join() is far faster than repeated string concatenation in IE

            // replace 'A's from padded nulls with '='s
            coded = coded.Substring(0, coded.Length - pad.Length) + pad;//e.Slice(0, coded.Length - pad.Length) + pad; //coded.slice(0, coded.length - pad.length) + pad;

            return coded;
        }

        #endregion

        #region Decode
        public static string Decode(string str)
        {
            return Decode(str, false);
        }

        public static string Decode(string str, bool utf8decode)
        {

            int o1, o2, o3, bits, h1, h2, h3, h4;
            string[] d;
            int c;
            string plain;
            string coded;

            string b64 = code;

            coded = utf8decode ? UTF8.Decode(str) : str;

            d = new string[coded.Length / 3];

            for (c = 0; c < coded.Length; c += 4)
            {  // unpack four hexets into three octets
                h1 = b64.IndexOf((char)coded[c]);
                h2 = b64.IndexOf((char)coded[c + 1]);
                h3 = b64.IndexOf((char)coded[c + 2]);
                h4 = b64.IndexOf((char)coded[c + 3]);

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                d[c / 4] = ((char)o1).ToString() + ((char)o2).ToString() + ((char)o3).ToString();

                // check for padding
                if (h4 == 0x40) d[c / 4] = ((char)o1).ToString() + ((char)o2).ToString();
                if (h3 == 0x40) d[c / 4] = ((char)o1).ToString();
            }

            plain = string.Join("", d);  // join() is far faster than repeated string concatenation in IE

            return utf8decode ? UTF8.Decode(plain) : plain;
        }
        #endregion


    }
    #endregion
  


}
