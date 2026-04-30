import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { API_URL } from '../../server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  green: "#10B981",
};

const TransactionDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract data passed from navigation via params
  const {
    reference,
    sender,
    sender_account,
    receiver,
    receiver_bank,
    amount,
    description,
    date,
  } = params;

  // HTML Template for the PDF
  const htmlContent = `
    <html>
    <head> 
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Transaction Receipt</title>
        <style>
            @page {
                margin: 0;
            }

            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
                font-size: 11px;
                margin: 0;
                padding: 0;
                background-color: #fff;
            }

            .receipt-container {
                width: 550px;
                margin: 0 auto;
                padding: 40px; /* Increased vertical padding for more height */
            }

            .header {
                text-align: center;
                border-bottom: 2px solid #F3F4F6; /* Updated border */
                padding-bottom: 20px; /* Updated padding */
                margin-bottom: 30px; /* Updated margin */
            }

            .bank-name {
                color: #B8860B;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-bottom: 5px;
            }

            .status {
                color: #10B981;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 14px;
                margin-top: 10px;
            }

            .amount {
                font-size: 36px;
                font-weight: bold;
                margin: 20px 0;
                color: #000;
            }
            .header h1 {
                color: #B8860B;
                margin: 5px 0;
                font-size: 18px;
                text-transform: uppercase;
            }

            .reference {
                font-family: 'Courier', monospace;
                font-size: 10px;
                margin-top: 10px;
                text-align: center;
                color: #777;
            }

            .section {
                margin-bottom: 12px;
            }

            .section-title {
                font-size: 9px;
                text-transform: uppercase;
                font-weight: bold;
                color: #999;
                border-bottom: 1px solid #f4f4f4;
                margin-bottom: 5px;
                padding-bottom: 2px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            td {
                padding: 3px 0;
                vertical-align: top;
            }

            .td-label {
                color: #666;
                width: 40%;
            }

            .td-value {
                text-align: right;
                font-weight: 600;
            }

            .amount-box {
                margin: 15px 0;
                text-align: center;
                background: #fafafa;
                border-top: 2px solid #B8860B;
                border-bottom: 2px solid #B8860B;
                padding: 10px;
            }

            .amount-text {
                font-size: 22px;
                font-weight: bold;
                color: #B8860B;
            }

            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 9px;
                color: #aaa;
                line-height: 1.4;
            }

            .status-badge {
                color: #27ae60;
                font-weight: bold;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header"> 
            <div class="header">
                <div class="bank-name">Z-ton XL DIGITAL BANK</div>
                <div class="status">Transaction Successful</div>
                <div class="amount">$${parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
                <div class="reference">REF: ${reference}</div>
            </div>

            <div class="section">
                <table style="margin-bottom: 10px;">
                    <tr>
                        <td class="td-label">Date</td>
                        <td class="td-value">${date || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="td-label">Status</td>
                        <td class="td-value"><span class="status-badge">Successful</span></td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <div class="section-title">Sender</div>
                <table>
                    <tr>
                        <td class="td-label">Name</td>
                        <td class="td-value">${sender || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="td-label">Account</td>
                        <td class="td-value" style="font-family: monospace;">${sender_account || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <div class="section-title">Receiver</div>
                <table>
                    <tr>
                        <td class="td-label">Beneficiary</td>
                        <td class="td-value">${receiver || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="td-label">Bank</td>
                        <td class="td-value">${receiver_bank || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            ${description ? `
            <div class="section">
                <div class="section-title">Note</div>
                <p>${description}</p>
            </div>
            ` : ''}

            <div class="amount-box">
                <p style="margin: 0; color: #666;">Amount Transferred</p>
                <div class="amount-text">$${parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>

            <div class="footer">
                <p>Thank you for using Z-ton. This is a computer-generated receipt.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  // Function to handle sharing the receipt file
  const handleShare = async () => {
    try {
      // Generate the PDF file from the HTML string
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      // Share the generated PDF
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      } else {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      }

    } catch (error) {
      console.error('Receipt share error details:', error);
      Alert.alert('Error', `Failed to process receipt: ${error.message}`);
    }
  };

  // Component to display each row of information in the receipt
  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitleWhite}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Main Receipt Card */}
        <View style={styles.receiptBody}>
          
          {/* Status Section */}
          <View style={styles.statusWrapper}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-sharp" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.successTitle}>Transaction Successful</Text>
            <Text style={styles.amountDisplay}>
                ${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
            </Text>
            <Text style={styles.referenceText}>REF: {reference}</Text>
          </View>

          {/* Details Section */}
          <View style={styles.detailsBox}>
            <Text style={styles.sectionHeader}>SENDER</Text>
            <InfoRow label="Sender" value={sender} />
            <InfoRow label="Account" value={sender_account} />
            
            <View style={styles.line} />
            
            <Text style={styles.sectionHeader}>RECEIVER</Text>
            <InfoRow label="Beneficiary" value={receiver} />
            <InfoRow label="Bank" value={receiver_bank} />
            
            <View style={styles.line} />

            <Text style={styles.sectionHeader}>TRANSACTION INFO</Text>
            <InfoRow label="Date" value={date} />
            <InfoRow label="Status" value="Successful" />
            {description ? <InfoRow label="Note" value={description} /> : null}
          </View>

          {/* Highlighted Amount Box - Mirroring Laravel Style */}
          <View style={styles.amountBox}>
             <Text style={styles.amountBoxLabel}>Amount Transferred</Text>
             <Text style={styles.amountBoxText}>
                ${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
             </Text>
          </View>

          {/* Bottom Branding */}
          <View style={styles.branding}>
            <Text style={styles.bankName}>Z-TON DIGITAL BANK</Text>
            <Text style={styles.footerNote}>This is an electronically generated receipt and requires no physical signature.</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => router.replace('(drawer)/(tabs)/overview')}>
            <Ionicons name="checkmark-done-outline" size={20} color={COLORS.black} />
            <Text style={styles.btnSecondaryText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.white} />
            <Text style={styles.btnPrimaryText}>Share</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: { padding: 5 },
  headerTitleWhite: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black }, // Kept for consistency if needed elsewhere
  scrollContent: { padding: 12, paddingBottom: 20, alignItems: 'center' },
  
  receiptBody: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  statusWrapper: { alignItems: 'center', marginBottom: 10 },
  successCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successTitle: { fontSize: 12, color: COLORS.green, fontWeight: 'bold', textTransform: 'uppercase' },
  amountDisplay: { fontSize: 24, fontWeight: 'bold', color: COLORS.black, marginTop: 4, marginBottom: 4 },
  referenceText: { fontSize: 10, color: COLORS.gray, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 15, borderStyle: 'dashed', borderRadius: 1 },
  detailsBox: { width: '100%' },
  sectionHeader: { fontSize: 9, fontWeight: 'bold', color: COLORS.gray, marginBottom: 4, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '500' },
  infoValue: { fontSize: 12, color: COLORS.black, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 20 },
  line: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 6 },
  
  // Amount Box Style
  amountBox: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginTop: 10,
    alignItems: 'center'
  },
  amountBoxLabel: { fontSize: 11, color: COLORS.gray, marginBottom: 2 },
  amountBoxText: { fontSize: 20, fontWeight: 'bold', color: COLORS.gold },

  branding: { marginTop: 15, alignItems: 'center' },
  bankName: { fontSize: 11, color: COLORS.gray, letterSpacing: 2, fontWeight: 'bold' },
  footerNote: { fontSize: 9, color: COLORS.gray, marginTop: 2 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightGray, flex: 0.48, paddingVertical: 12, borderRadius: 12 },
  btnSecondaryText: { marginLeft: 8, fontSize: 13, fontWeight: 'bold', color: COLORS.black },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.black, flex: 0.48, paddingVertical: 12, borderRadius: 12 },
  btnPrimaryText: { marginLeft: 8, fontSize: 13, fontWeight: 'bold', color: COLORS.white },
});
