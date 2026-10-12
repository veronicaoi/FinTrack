import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { categorizeByKeyword } from "@/utils/categorize";
import { createTransaction } from "@/services/api";

// NOTE: kept intentionally minimal (merchant + amount only) since
// manual entry may be replaced or supplemented by a Stripe (or similar)
// transaction-import integration later in the project. Avoiding extra
// fields (date picker, notes, type toggle, etc.) here so this isn't
// rebuilt from scratch if that direction changes.
export default function AddTransactionScreen() {
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [previewCategory, setPreviewCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleMerchantChange = (text: string) => {
    setMerchantName(text);
    setPreviewCategory(text.length > 0 ? categorizeByKeyword(text) : null);
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setSavedMessage(null);

    const parsedAmount = parseFloat(amount);
    if (!merchantName.trim() || isNaN(parsedAmount)) {
      setErrorMessage("Please enter a merchant name and a valid amount.");
      return;
    }

    setIsSaving(true);
    try {
      await createTransaction({
        merchantName: merchantName.trim(),
        amount: parsedAmount,
        category: previewCategory ?? "Uncategorized",
      });
      setSavedMessage("Transaction saved.");
      setMerchantName("");
      setAmount("");
      setPreviewCategory(null);
    } catch (error) {
      setErrorMessage("Could not save transaction. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      <TextInput
        style={styles.input}
        placeholder="Merchant name (e.g. Starbucks)"
        value={merchantName}
        onChangeText={handleMerchantChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      {previewCategory && (
        <Text style={styles.preview}>Suggested category: {previewCategory}</Text>
      )}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {savedMessage && <Text style={styles.success}>{savedMessage}</Text>}

      {isSaving ? (
        <ActivityIndicator />
      ) : (
        <Button title="Save Transaction" onPress={handleSave} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  preview: { marginBottom: 12, color: "#2a7" },
  error: { marginBottom: 12, color: "#c0392b" },
  success: { marginBottom: 12, color: "#2a7" },
});
